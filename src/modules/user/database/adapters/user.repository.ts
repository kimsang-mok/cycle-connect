import { Injectable, Logger } from '@nestjs/common';
import { SqlRepositoryBase } from '@src/libs/db/sql-repository.base';
import { UserEntity } from '../../domain/user.entity';
import { UserRepositoryPort } from '../ports/user.repository.port';
import { InjectPool } from 'nestjs-slonik';
import { DatabasePool, sql } from 'slonik';
import { UserMapper } from '../../user.mapper';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserModel, userSchema } from '../user.schema';

/**
 *  Repository is used for retrieving/saving domain entities
 * */
@Injectable()
export class UserRepository
  extends SqlRepositoryBase<UserEntity, UserModel>
  implements UserRepositoryPort
{
  protected tableName = 'users';

  protected schema = userSchema;

  constructor(
    @InjectPool()
    pool: DatabasePool,
    mapper: UserMapper,
    eventEmitter: EventEmitter2,
  ) {
    super(pool, mapper, eventEmitter, new Logger(UserRepository.name));
  }

  async findOneByEmail(email: string): Promise<UserEntity> {
    const user = await this.pool.one(
      sql.type(userSchema)`SELECT * FROM "users" WHERE email = ${email}`,
    );
    return this.mapper.toDomain(user);
  }

  async findOneByPhone(phone: string): Promise<UserEntity> {
    const user = await this.pool.one(
      sql.type(userSchema)`SELECT * FROM "users" WHERE phone = ${phone}`,
    );

    return this.mapper.toDomain(user);
  }
}
