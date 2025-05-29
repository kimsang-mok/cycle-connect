import { Mapper } from '@src/libs/ddd';
import { SessionEntity } from './domain/session.entity';
import { SessionModel, sessionSchema } from './database/session.schema';

export class SessionMapper implements Mapper<SessionEntity, SessionModel, any> {
  toPersistence(entity: SessionEntity): SessionModel {
    const copy = entity.getProps();
    const record: SessionModel = {
      id: copy.id,
      userId: copy.userId,
      accessToken: copy.accessToken,
      refreshToken: copy.refreshToken,
      createdAt: copy.createdAt,
      updatedAt: copy.updatedAt,
    };
    return sessionSchema.parse(record);
  }

  toDomain(record: SessionModel): SessionEntity {
    const entity = new SessionEntity({
      id: record.id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      props: {
        userId: record.userId,
        accessToken: record.accessToken,
        refreshToken: record.refreshToken,
      },
    });
    return entity;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toResponse(entity: SessionEntity) {
    throw new Error('Not implemented');
  }
}
