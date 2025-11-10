import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetEventsDto {
  @ApiPropertyOptional({
    description: 'Максимальное количество возвращаемых мероприятий',
    minimum: 1,
    example: 10,
  })
  @IsOptional()
  @Type(() => Number) 
  @IsInt({ message: 'limit должен быть целым числом' })
  @Min(1, { message: 'limit должен быть не меньше 1' })
  limit?: number;

  @ApiPropertyOptional({
    description: 'Количество мероприятий, которые нужно пропустить',
    minimum: 0,
    example: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'offset должен быть целым числом' })
  @Min(0, { message: 'offset должен быть не меньше 0' })
  offset?: number;
}
