import { z } from 'zod';
import { UserRoles } from '../../domain/user.types';
import { Injectable, Logger } from '@nestjs/common';
import { SqlRepositoryBase } from '@src/libs/db/sql-repository.base';
import { UserEntity } from '../../domain/user.entity';
import { UserRepositoryPort } from '../ports/user.repository.port';
import { InjectPool } from 'nestjs-slonik';
import { DatabasePool, sql } from 'slonik';
import { UserMapper } from '../../user.mapper';
import { EventEmitter2 } from '@nestjs/event-emitter';

/**
 * Runtime validation of user object for extra safety (in case database schema changes).
 * https://github.com/gajus/slonik#runtime-validation
 * If you prefer to avoid performance penalty of validation, use interfaces instead.
 */
export const userSchema = z.object({
  id: z.string().uuid().refine(Boolean),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  email: z.string().email().optional().nullable(),
  phone: z.string().min(8).max(15).optional().nullable(),
  password: z.string().min(6),
  role: z.nativeEnum(UserRoles),
});

export type UserModel = z.TypeOf<typeof userSchema>;

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
