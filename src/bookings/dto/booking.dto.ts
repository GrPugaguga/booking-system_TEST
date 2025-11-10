import { ApiProperty } from '@nestjs/swagger';

export class BookingDto {
  @ApiProperty({ description: 'Уникальный ID бронирования' })
  id: number;

  @ApiProperty({ description: 'ID мероприятия' })
  eventId: number;

  @ApiProperty({ description: 'ID пользователя' })
  userId: string;

  @ApiProperty({ description: 'Дата и время создания бронирования' })
  createdAt: Date;
}
