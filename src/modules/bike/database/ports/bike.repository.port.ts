import { BikeEntity } from '../../domain/bike.entity';
import { RepositoryPort } from '@src/libs/ddd';

export interface BikeRepositoryPort extends RepositoryPort<BikeEntity> {
  findOneByEnginePower(power: number): Promise<BikeEntity>;
}
