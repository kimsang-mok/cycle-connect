import { InjectPool } from 'nestjs-slonik';
import { DatabasePool, sql } from 'slonik';
import { BikeRepositoryPort } from '../ports/bike.repository.port';
import { BikeMapper } from '../../bike.mapper';
import { BikeEntity } from '../../domain/bike.entity';
import { SqlRepositoryBase } from '@src/libs/db/sql-repository.base';
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BikeModel, bikeSchema } from '../bike.schema';

@Injectable()
export class BikeRepository
  extends SqlRepositoryBase<BikeEntity, BikeModel>
  implements BikeRepositoryPort
{
  protected tableName = 'bikes';

  protected schema = bikeSchema;

  constructor(
    @InjectPool()
    pool: DatabasePool,
    mapper: BikeMapper,
    eventEmitter: EventEmitter2,
  ) {
    super(pool, mapper, eventEmitter, new Logger(BikeRepository.name));
  }

  async findOneByEnginePower(power: number): Promise<BikeEntity> {
    const bike = await this.pool.one(
      sql.type(
        bikeSchema,
      )`SELECT * FROM "bikes" WHERE "enginePower" = ${power}`,
    );

    return this.mapper.toDomain(bike);
  }
}
