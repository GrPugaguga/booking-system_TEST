import { Controller, Post, Body, ConflictException, NotFoundException, InternalServerErrorException, Get, Param } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOperation, ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { BookingDto } from './dto/booking.dto'; 

@ApiTags('bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post('reserve')
  @ApiOperation({ summary: 'Забронировать место на мероприятие' })
  @ApiCreatedResponse({ description: 'Место успешно забронировано.', type: BookingDto })
  @ApiConflictResponse({ description: 'Нет свободных мест или пользователь уже забронировал.' })
  @ApiNotFoundResponse({ description: 'Мероприятие не найдено.' })
  @ApiBody({ type: CreateBookingDto })
  async reserve(@Body() createBookingDto: CreateBookingDto): Promise<BookingDto> {
    try {
      return await this.bookingsService.reserve(createBookingDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      }
      throw new InternalServerErrorException('An unexpected error occurred during booking.');
    }
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Получить все бронирования пользователя' })
  @ApiOkResponse({ description: 'Список бронирований пользователя успешно получен.', type: [BookingDto] })
  async getBookingsByUserId(@Param('userId') userId: string): Promise<BookingDto[]> {
    return this.bookingsService.getBookingsByUserId(userId);
  }
}