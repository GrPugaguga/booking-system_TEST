import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { BookingsModule } from './bookings/bookings.module';
import { DatabaseModule } from './database/database.module';
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [EventsModule, BookingsModule, DatabaseModule, CacheModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
