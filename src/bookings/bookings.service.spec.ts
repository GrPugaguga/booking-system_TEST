import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { DatabaseService } from '../database/database.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';

describe('BookingsService', () => {
  let service: BookingsService;
  let dbServiceMock: any; 

  beforeEach(async () => {
    dbServiceMock = {
      db: {
        transaction: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: DatabaseService,
          useValue: dbServiceMock,
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('reserve', () => {
    it('should successfully reserve a booking if a seat is available', async () => {
      const createDto: CreateBookingDto = { eventId: 1, userId: 'user1' };
      const mockBooking = { id: 1, ...createDto, createdAt: new Date() };

      dbServiceMock.db.transaction.mockImplementation(async (callback) => {
        const mockTx = {
          update: () => ({
            set: () => ({
              where: () => ({
                returning: () => Promise.resolve([{ id: 1, availableSeats: 99 }]),
              }),
            }),
          }),
          insert: () => ({
            values: () => ({
              returning: () => Promise.resolve([mockBooking]),
            }),
          }),
        };
        return callback(mockTx);
      });

      // Act
      const result = await service.reserve(createDto);

      // Assert
      expect(result).toEqual(mockBooking);
      expect(dbServiceMock.db.transaction).toHaveBeenCalled();
    });

    it('should throw a ConflictException if no seats are available', async () => {
      // Arrange
      const createDto: CreateBookingDto = { eventId: 1, userId: 'user1' };

      dbServiceMock.db.transaction.mockImplementation(async (callback) => {
        const mockTx = {
          update: () => ({
            set: () => ({
              where: () => ({
                returning: () => Promise.resolve([]), 
              }),
            }),
          }),
          query: { events: { findFirst: () => Promise.resolve({ id: 1 }) } },
        };
        return callback(mockTx);
      });

      // Act & Assert
      await expect(service.reserve(createDto)).rejects.toThrow(ConflictException);
    });

    it('should throw a NotFoundException if the event does not exist', async () => {
      // Arrange
      const createDto: CreateBookingDto = { eventId: 999, userId: 'user1' };

      dbServiceMock.db.transaction.mockImplementation(async (callback) => {
        const mockTx = {
          update: () => ({
            set: () => ({
              where: () => ({
                returning: () => Promise.resolve([]),
              }),
            }),
          }),
          query: { events: { findFirst: () => Promise.resolve(undefined) } }, // Событие не найдено
        };
        return callback(mockTx);
      });

      // Act & Assert
      await expect(service.reserve(createDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw a ConflictException if the user has already booked', async () => {
      // Arrange
      const createDto: CreateBookingDto = { eventId: 1, userId: 'user1' };

      dbServiceMock.db.transaction.mockImplementation(async (callback) => {
        const mockTx = {
          update: () => ({
            set: () => ({
              where: () => ({
                returning: () => Promise.resolve([{ id: 1, availableSeats: 99 }]),
              }),
            }),
          }),
          insert: () => ({
            values: () => ({
              returning: () => Promise.reject(new Error('duplicate key value violates unique constraint')),
            }),
          }),
        };
        return callback(mockTx);
      });

      // Act & Assert
      await expect(service.reserve(createDto)).rejects.toThrow(ConflictException);
    });
  });
});
