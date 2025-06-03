import { Test } from '@nestjs/testing';
import { CreateBikeService } from './create-bike.service';
import { CreateBikeCommand } from './create-bike.command';
import { BIKE_REPOSITORY } from '../../bike.di-tokens';
import { BikeRepositoryPort } from '../../database/ports/bike.repository.port';
import { BikeTypes } from '../../domain/bike.types';
import { Price } from '../../domain/value-objects/price.value-object';

describe('CreateBikeService', () => {
  let service: CreateBikeService;
  let bikeRepo: jest.Mocked<BikeRepositoryPort>;

  beforeEach(async () => {
    const mockRepo: jest.Mocked<BikeRepositoryPort> = {
      insert: jest.fn(),
      transaction: jest.fn(),
    } as any;

    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateBikeService,
        {
          provide: BIKE_REPOSITORY,
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = moduleRef.get(CreateBikeService);
    bikeRepo = moduleRef.get(BIKE_REPOSITORY);
  });

  it('should create and insert a bike, then return its id', async () => {
    const command = new CreateBikeCommand({
      ownerId: 'user-123',
      type: BikeTypes.motorbike,
      model: 'Honda Wave',
      enginePower: 125,
      description: 'A fuel-efficient bike',
      pricePerDay: new Price(12.5),
      photoKeys: ['uploads/user-123/photo1.jpg'],
      thumbnailKey: 'uploads/user-123/photo1.jpg',
    });

    bikeRepo.transaction.mockImplementation(async (cb) => {
      await cb(); // execute insert inside
      return 'mock-bike-id';
    });

    const result = await service.execute(command);

    expect(typeof result).toBe('string');
    expect(bikeRepo.transaction).toHaveBeenCalled();
    expect(bikeRepo.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        getProps: expect.any(Function),
        get id() {
          return expect.any(String);
        },
      }),
    );
    expect(result).toEqual('mock-bike-id');
  });
});
