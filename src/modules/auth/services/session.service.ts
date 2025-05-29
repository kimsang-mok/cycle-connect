import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SessionRepositoryPort } from '../database/ports/session.repository.port';
import { SessionEntity } from '../domain/session.entity';
import { Err, Ok, Result } from 'oxide.ts';
import { AggregateId } from '@src/libs/ddd';
import { CreateSessionProps } from '../domain/auth.types';
import { SESSION_REPOSITORY } from '../auth.di-tokens';

@Injectable()
export class SessionService {
  constructor(
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepo: SessionRepositoryPort,
  ) {}

  async create(props: CreateSessionProps): Promise<AggregateId> {
    const session = SessionEntity.create(props);
    await this.sessionRepo.insert(session);
    return session.id;
  }

  async findById(id: string): Promise<SessionEntity | null> {
    return (await this.sessionRepo.findOneById(id)).unwrap();
  }

  async findOneByRefreshToken(
    refreshToken: string,
  ): Promise<SessionEntity | null> {
    return this.sessionRepo.findOneByRefreshToken(refreshToken);
  }

  async verifySession(
    cookiesRefreshToken: string,
    userId: string,
  ): Promise<SessionEntity> {
    const session = await this.findOneByRefreshToken(cookiesRefreshToken);

    if (!session || session.getProps().userId !== userId) {
      if (session) {
        await this.deleteById(session.id);
      }
      throw new UnauthorizedException();
    }

    return session;
  }

  async deleteById(id: string): Promise<Result<boolean, NotFoundException>> {
    const found = await this.sessionRepo.findOneById(id);
    if (found.isNone()) return Err(new NotFoundException());
    const session = found.unwrap();
    const result = await this.sessionRepo.delete(session);
    return Ok(result);
  }

  async deleteByRefreshToken(conditions: {
    refreshToken: string;
  }): Promise<boolean> {
    return this.sessionRepo.deleteByRefreshToken(conditions.refreshToken);
  }

  async update(
    id: string,
    payload: { accessToken: string; refreshToken: string },
  ): Promise<void> {
    return this.sessionRepo.update(id, payload);
  }
}
