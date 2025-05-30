import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ActivateBikeCommand } from './activate-bike.command';
import { AggregateId } from '@src/libs/ddd';
import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import { BIKE_REPOSITORY } from '../../bike.di-tokens';
import { BikeRepositoryPort } from '../../database/ports/bike.repository.port';

@CommandHandler(ActivateBikeCommand)
export class ActivateBikeService
  implements ICommandHandler<ActivateBikeCommand, AggregateId>
{
  constructor(
    @Inject(BIKE_REPOSITORY)
    protected bikeRepo: BikeRepositoryPort,
  ) {}

  async execute(command: ActivateBikeCommand): Promise<AggregateId> {
    const bike = await this.bikeRepo.findOneById(command.bikeId);

    if (!bike) {
      throw new NotFoundException();
    }

    if (bike.getProps().ownerId !== command.requesterId) {
      throw new ForbiddenException('You do not own the bike');
    }

    bike.activate();
    await this.bikeRepo.save(bike);

    return bike.id;
  }
}
