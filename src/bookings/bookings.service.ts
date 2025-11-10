import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { DatabaseService } from '../database/database.service';
import { events, bookings } from '../database/schema';
import { eq, gt, and, sql } from 'drizzle-orm';
import { BookingDto } from './dto/booking.dto'; 

@Injectable()
export class BookingsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async reserve(createBookingDto: CreateBookingDto) {
    const { eventId, userId } = createBookingDto;

    return await this.databaseService.db.transaction(async (tx) => {
      const [updatedEvent] = await tx
        .update(events)
        .set({ availableSeats: sql`${events.availableSeats} - 1` })
        .where(and(eq(events.id, eventId), gt(events.availableSeats, 0)))
        .returning({ id: events.id, availableSeats: events.availableSeats });

      if (!updatedEvent) {
        const eventExists = await tx.query.events.findFirst({
          where: eq(events.id, eventId),
        });
        if (!eventExists) {
          throw new NotFoundException(`Event with ID ${eventId} not found.`);
        }
        throw new ConflictException(`No available seats for event with ID ${eventId}.`);
      }

      try {
        const [newBooking] = await tx
          .insert(bookings)
          .values({
            eventId: eventId,
            userId: userId,
          })
          .returning();
        return newBooking;
      } catch (error) {
        if (error.cause?.code === '23505') {
          throw new ConflictException(`User ${userId} has already booked a seat for event ${eventId}.`);
        }
        throw error;
      }
    });
  }

  async getBookingsByUserId(userId: string): Promise<BookingDto[]> {
    const userBookings = await this.databaseService.db
      .select()
      .from(bookings)
      .where(eq(bookings.userId, userId));
    
    return userBookings;
  }
}