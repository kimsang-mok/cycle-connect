import { Logger, Module, Provider } from '@nestjs/common';
import { BikeMapper } from './bike.mapper';
import { CreateBikeController } from './commands/create-bike/create-bike.controller';
import { BIKE_REPOSITORY } from './bike.di-tokens';
import { BikeRepository } from './database/adapters/bike.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateBikeService } from './commands/create-bike/create-bike.service';
import { ActivateBikeService } from './commands/activate-bike/activate-bike.service';
import { DeactivateBikeService } from './commands/deactivate-bike/deactivate-bike.service';
import { ActivateBikeController } from './commands/activate-bike/activate-bike.controller';
import { DeactivateBikeController } from './commands/deactivate-bike/deactivate-bike.controller';
import { MakeBikeUnavailableWhenBookingIsCreated } from './event-handlers/make-bike-unavailable-when-booking-is-created.domain-event.handler';
import { FileModule } from '../file/file.module';
import { FindBikesQueryHandler } from './queries/find-bikes/find-bikes.query-handler';
import { FindBikesController } from './queries/find-bikes/find-bikes.controller';

const controllers = [
  CreateBikeController,
  ActivateBikeController,
  DeactivateBikeController,
  FindBikesController,
];

const commandHandlers: Provider[] = [
  CreateBikeService,
  ActivateBikeService,
  DeactivateBikeService,
];

const queryHandlers: Provider[] = [FindBikesQueryHandler];

const repositories: Provider[] = [
  {
    provide: BIKE_REPOSITORY,
    useClass: BikeRepository,
  },
];

const eventHandlers: Provider[] = [MakeBikeUnavailableWhenBookingIsCreated];

const mappers: Provider[] = [BikeMapper];

@Module({
  imports: [CqrsModule, FileModule],
  controllers: [...controllers],
  providers: [
    Logger,
    ...repositories,
    ...commandHandlers,
    ...queryHandlers,
    ...eventHandlers,
    ...mappers,
  ],
  exports: [BIKE_REPOSITORY],
})
export class BikeModule {}
