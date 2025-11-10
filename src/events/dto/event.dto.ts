import { ApiProperty } from '@nestjs/swagger';

export class EventDto {
  @ApiProperty({ description: 'Уникальный ID мероприятия' })
  id: number;

  @ApiProperty({ description: 'Название мероприятия' })
  name: string;

  @ApiProperty({ description: 'Общее количество мест' })
  totalSeats: number;

  @ApiProperty({ description: 'Количество доступных мест' })
  availableSeats: number;
}
