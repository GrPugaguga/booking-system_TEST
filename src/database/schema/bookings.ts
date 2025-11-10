import { pgTable, serial, varchar, integer, timestamp, unique, index} from 'drizzle-orm/pg-core';
import { events } from './events'; 

export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').references(() => events.id).notNull(), 
  userId: varchar('user_id', { length: 256 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(), 
}, (table) => {
  return {
    unq: unique('event_user_unique').on(table.eventId, table.userId), 
    eventIdIdx: index('event_id_idx').on(table.eventId),
  };
});