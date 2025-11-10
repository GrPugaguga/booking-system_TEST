import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({
    description: 'ID мероприятия для бронирования',
    example: 1,
  })
  @IsInt({ message: 'eventId должен быть целым числом' })
  @IsNotEmpty({ message: 'eventId не может быть пустым' })
  eventId: number;

  @ApiProperty({
    description: 'Уникальный идентификатор пользователя',
    example: 'user123',
  })
  @IsString({ message: 'userId должен быть строкой' })
  @IsNotEmpty({ message: 'userId не может быть пустым' })
  userId: string;
}