import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { SessionRepositoryPort } from '../database/ports/session.repository.port';
import { SessionEntity } from '../domain/session.entity';
import { AggregateId } from '@src/libs/ddd';
import { CreateSessionProps } from '../domain/auth.types';
import { SESSION_REPOSITORY } from '../auth.di-tokens';
import { NotFoundException } from '@src/libs/exceptions';

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
    return await this.sessionRepo.findOneById(id);
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

  async deleteById(id: string): Promise<boolean> {
    const session = await this.sessionRepo.findOneById(id);
    if (!session) throw new NotFoundException();
    const result = await this.sessionRepo.delete(session);
    return result;
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
