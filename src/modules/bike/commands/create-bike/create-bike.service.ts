import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateBikeCommand } from './create-bike.command';
import { AggregateId } from '@src/libs/ddd';
import { Inject } from '@nestjs/common';
import { BIKE_REPOSITORY } from '../../bike.di-tokens';
import { BikeRepositoryPort } from '../../database/ports/bike.repository.port';
import { BikeEntity } from '../../domain/bike.entity';

@CommandHandler(CreateBikeCommand)
export class CreateBikeService
  implements ICommandHandler<CreateBikeCommand, AggregateId>
{
  constructor(
    @Inject(BIKE_REPOSITORY)
    protected readonly bikeRepo: BikeRepositoryPort,
  ) {}

  execute(command: CreateBikeCommand): Promise<string> {
    const bike = BikeEntity.create({
      type: command.type,
      model: command.model,
      ownerId: command.ownerId,
      enginePower: command.enginePower,
      description: command.description,
      pricePerDay: command.pricePerDay,
      photoKeys: command.photoKeys,
      thumbnailKey: command.thumbnailKey,
    });

    return this.bikeRepo.transaction(async () => {
      await this.bikeRepo.insert(bike);
      return bike.id;
    });
  }
}
