import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { DatabaseService } from '../database/database.service';
import { CreateEventDto } from './dto/create-event.dto';
import { GetEventsDto } from './dto/get-events.dto';
import { desc } from 'drizzle-orm';
import { events } from '../database/schema';

describe('EventsService', () => {
  let service: EventsService;
  let dbServiceMock: any;
  let mockQueryBuilder: any;

  beforeEach(async () => {
    mockQueryBuilder = {
      from: jest.fn().mockReturnThis(), 
      limit: jest.fn().mockReturnThis(),
      offset: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      then: jest.fn(),
    };

    dbServiceMock = {
      db: {
        insert: jest.fn().mockReturnThis(),
        values: jest.fn().mockReturnThis(),
        returning: jest.fn(),
        select: jest.fn(() => mockQueryBuilder), 
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: DatabaseService,
          useValue: dbServiceMock,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new event with available seats equal to total seats', async () => {
      // Arrange
      const createDto: CreateEventDto = { name: 'New Event', totalSeats: 100 };
      const expectedEvent = { ...createDto, id: 1, availableSeats: 100 };
      
      dbServiceMock.db.insert().values().returning.mockResolvedValue([expectedEvent]);

      // Act
      const result = await service.create(createDto);

      // Assert
      expect(result).toEqual(expectedEvent);
      expect(dbServiceMock.db.insert).toHaveBeenCalledWith(events);
      expect(dbServiceMock.db.insert().values).toHaveBeenCalledWith({
        name: createDto.name,
        totalSeats: createDto.totalSeats,
        availableSeats: createDto.totalSeats, 
      });
    });
  });

  describe('getList', () => {
    it('should fetch a list of events and order them by id descending', async () => {
      // Arrange
      const mockEvents = [{ id: 2, name: 'Event 2' }, { id: 1, name: 'Event 1' }];
      mockQueryBuilder.then.mockImplementation((callback) => callback(mockEvents));

      // Act
      const result = await service.getList({});

      // Assert
      expect(result).toEqual(mockEvents);
      expect(dbServiceMock.db.select).toHaveBeenCalled();
      expect(mockQueryBuilder.from).toHaveBeenCalledWith(events);
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(desc(events.id));
      expect(mockQueryBuilder.limit).not.toHaveBeenCalled();
      expect(mockQueryBuilder.offset).not.toHaveBeenCalled();
    });

    it('should apply limit and offset when provided', async () => {
      // Arrange
      const getDto: GetEventsDto = { limit: 10, offset: 5 };
      mockQueryBuilder.then.mockImplementation((callback) => callback([]));

      // Act
      await service.getList(getDto);

      // Assert
      expect(mockQueryBuilder.limit).toHaveBeenCalledWith(10);
      expect(mockQueryBuilder.offset).toHaveBeenCalledWith(5);
    });
  });
});
