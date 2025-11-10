import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { ApiCreatedResponse, ApiOperation, ApiBody, ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { EventDto } from './dto/event.dto';
import { GetEventsDto } from './dto/get-events.dto';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать новое мероприятие' })
  @ApiCreatedResponse({
    description: 'Мероприятие успешно создано.',
    type: EventDto,
  })
  @ApiBody({ type: CreateEventDto })
  create(@Body() createEventDto: CreateEventDto): Promise<EventDto> {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список мероприятий' })
  @ApiOkResponse({
    description: 'Список мероприятий успешно получен.',
    type: [EventDto], 
  })
  findAll(@Query() getEventsDto: GetEventsDto): Promise<EventDto[]> {
    return this.eventsService.getList(getEventsDto);
  }
}