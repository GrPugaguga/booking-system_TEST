import { pgTable, serial, varchar, integer } from 'drizzle-orm/pg-core';

export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  totalSeats: integer('total_seats').notNull(),
  availableSeats: integer('available_seats').notNull()
});

// в миграции также было добавлено правило 
// ALTER TABLE "events" ADD CONSTRAINT "events_available_seats_check" CHECK (available_seats >= 0);