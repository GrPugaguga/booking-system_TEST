import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateEventDto {
  @ApiProperty({
    description: 'Название мероприятия',
    example: 'Конференция по NestJS',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Общее количество мест на мероприятии',
    example: 150,
  })
  @IsInt()
  @Min(1, { message: 'Количество мест должно быть не меньше 1' })
  @IsNotEmpty()
  totalSeats: number;
}