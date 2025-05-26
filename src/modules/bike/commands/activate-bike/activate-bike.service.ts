import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ActivateBikeCommand } from './activate-bike.command';
import { Ok, Result } from 'oxide.ts';
import { AggregateId } from '@src/libs/ddd';
import { ForbiddenException, Inject } from '@nestjs/common';
import { BIKE_REPOSITORY } from '../../bike.di-tokens';
import { BikeRepositoryPort } from '../../database/ports/bike.repository.port';

@CommandHandler(ActivateBikeCommand)
export class ActivateBikeService
  implements ICommandHandler<ActivateBikeCommand, Result<AggregateId, Error>>
{
  constructor(
    @Inject(BIKE_REPOSITORY)
    protected bikeRepo: BikeRepositoryPort,
  ) {}

  async execute(
    command: ActivateBikeCommand,
  ): Promise<Result<AggregateId, Error>> {
    try {
      const bike = (await this.bikeRepo.findOneById(command.bikeId)).unwrap();

      if (bike.getProps().ownerId !== command.requesterId) {
        throw new ForbiddenException('You do not own the bike');
      }

      bike.activate();
      await this.bikeRepo.save(bike);

      return Ok(bike.id);
    } catch (error) {
      throw error;
    }
  }
}
