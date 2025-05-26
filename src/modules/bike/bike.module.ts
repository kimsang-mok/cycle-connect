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

const controllers = [
  CreateBikeController,
  ActivateBikeController,
  DeactivateBikeController,
];

const commandHandlers: Provider[] = [
  CreateBikeService,
  ActivateBikeService,
  DeactivateBikeService,
];

const repositories: Provider[] = [
  {
    provide: BIKE_REPOSITORY,
    useClass: BikeRepository,
  },
];

const mappers: Provider[] = [BikeMapper];

@Module({
  imports: [CqrsModule],
  controllers: [...controllers],
  providers: [Logger, ...repositories, ...commandHandlers, ...mappers],
})
export class BikeModule {}
