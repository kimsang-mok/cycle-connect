import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeactivateBikeCommand } from './deactivate-bike.command';
import { AggregateId } from '@src/libs/ddd';
import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import { BIKE_REPOSITORY } from '../../bike.di-tokens';
import { BikeRepositoryPort } from '../../database/ports/bike.repository.port';

@CommandHandler(DeactivateBikeCommand)
export class DeactivateBikeService
  implements ICommandHandler<DeactivateBikeCommand, AggregateId>
{
  constructor(
    @Inject(BIKE_REPOSITORY)
    protected bikeRepo: BikeRepositoryPort,
  ) {}

  async execute(command: DeactivateBikeCommand): Promise<AggregateId> {
    const bike = await this.bikeRepo.findOneById(command.bikeId);

    if (!bike) {
      throw new NotFoundException();
    }

    if (bike.getProps().ownerId !== command.requesterId) {
      throw new ForbiddenException('You do not own the bike');
    }

    bike.deactivate();
    await this.bikeRepo.save(bike);

    return bike.id;
  }
}
