import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { DatabaseService } from '../database/database.service';
import { events } from '../database/schema/events';
import { GetEventsDto } from './dto/get-events.dto';
import { EventDto } from './dto/event.dto';
import { desc } from 'drizzle-orm';

@Injectable()
export class EventsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createEventDto: CreateEventDto): Promise<EventDto> {
    const [newEvent] = await this.databaseService.db
      .insert(events)
      .values({
        name: createEventDto.name,
        totalSeats: createEventDto.totalSeats,
        availableSeats: createEventDto.totalSeats,
      })
      .returning(); 

    return newEvent;
  }

  async getList(getEventsDto: GetEventsDto): Promise<EventDto[]> {
    const { limit, offset } = getEventsDto;

    const query = this.databaseService.db
      .select()
      .from(events)
      .orderBy(desc(events.id)); 

    if (limit) {
      query.limit(limit);
    }
    if (offset) {
      query.offset(offset);
    }

    return query;
  }

}