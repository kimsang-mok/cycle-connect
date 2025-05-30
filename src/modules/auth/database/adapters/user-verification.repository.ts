import { Injectable, Logger } from '@nestjs/common';
import { SqlRepositoryBase } from '@src/libs/db/sql-repository.base';
import { UserVerificationEntity } from '../../domain/user-verification.entity';
import { UserVerificationRepositoryPort } from '../ports/user-verification.repository.port';
import { InjectPool } from 'nestjs-slonik';
import { DatabasePool, sql } from 'slonik';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserVerificationMapper } from '../../user-verification.mapper';
import {
  UserVerificationModel,
  userVerificationSchema,
} from '../user-verification.schema';

@Injectable()
export class UserVerificationRepository
  extends SqlRepositoryBase<UserVerificationEntity, UserVerificationModel>
  implements UserVerificationRepositoryPort
{
  protected tableName = 'user_verifications';
  protected schema = userVerificationSchema;

  constructor(
    @InjectPool() pool: DatabasePool,
    mapper: UserVerificationMapper,
    eventEmitter: EventEmitter2,
  ) {
    super(
      pool,
      mapper,
      eventEmitter,
      new Logger(UserVerificationRepository.name),
    );
  }

  async findOneByTarget(target: string): Promise<UserVerificationEntity> {
    const verification = await this.pool.one(
      sql.type(userVerificationSchema)`
      SELECT * FROM "user_verifications" WHERE "target" = ${target}
    `,
    );

    return this.mapper.toDomain(verification);
  }

  async findOneByUserId(userId: string): Promise<UserVerificationEntity> {
    const verification = await this.pool.one(
      sql.type(
        userVerificationSchema,
      )`SELECT * FROM "user_verifications" WHERE "userId" = ${userId}`,
    );

    return this.mapper.toDomain(verification);
  }
}
