import { SqlRepositoryBase } from '@src/libs/db/sql-repository.base';
import { SessionEntity } from '../../domain/session.entity';
import { SessionRepositoryPort } from '../ports/session.repository.port';
import { SessionModel, sessionSchema } from '../session.schema';
import { InjectPool } from 'nestjs-slonik';
import { DatabasePool, sql } from 'slonik';
import { SessionMapper } from '../../session.mapper';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Logger } from '@nestjs/common';

export class SessionRepository
  extends SqlRepositoryBase<SessionEntity, SessionModel>
  implements SessionRepositoryPort
{
  protected tableName = 'sessions';

  protected schema = sessionSchema;

  constructor(
    @InjectPool() pool: DatabasePool,
    mapper: SessionMapper,
    eventEmitter: EventEmitter2,
  ) {
    super(pool, mapper, eventEmitter, new Logger(SessionRepository.name));
  }

  async findOneByRefreshToken(refreshToken: string): Promise<SessionEntity> {
    const session = await this.pool.one(
      sql.type(this.schema)`
        SELECT * FROM "sessions" WHERE "refreshToken" = ${refreshToken}
        `,
    );

    return this.mapper.toDomain(session);
  }

  async deleteByRefreshToken(refreshToken: string): Promise<boolean> {
    const query = sql`DELETE FROM ${sql.identifier([this.tableName])} WHERE "refreshToken" = ${refreshToken}`;
    const result = await this.pool.query(query);
    return result.rowCount > 0;
  }

  async update(
    id: string,
    payload: { accessToken: string; refreshToken: string },
  ): Promise<void> {
    const query = sql.type(this.schema)`
        UPDATE ${sql.identifier([this.tableName])}
        SET ${sql.join(
          [
            sql`"accessToken" = ${payload.accessToken}`,
            sql`"refreshToken" = ${payload.refreshToken}`,
          ],
          sql`, `,
        )}
        WHERE "id" = ${id}
        `;

    await this.pool.query(query);
  }
}
