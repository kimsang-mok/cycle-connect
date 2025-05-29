import { Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserCreatedDomainEvent } from '@src/modules/user/domain/events/user-created.domain-event';
import { USER_VERIFICATION_REPOSITORY } from '../auth.di-tokens';
import { UserVerificationEntity } from '../domain/user-verification.entity';
import { JwtService } from '@nestjs/jwt';
import { authConfig } from '@src/configs/auth.config';
import { UserVerificationRepositoryPort } from '../database/ports/user-verification.repository.port';

export class CreateUserVerificationWhenUserIsCreatedDomainEventHandler {
  constructor(
    @Inject(USER_VERIFICATION_REPOSITORY)
    private readonly userVerificationRepo: UserVerificationRepositoryPort,
    private readonly jwtService: JwtService,
  ) {}

  @OnEvent(UserCreatedDomainEvent.name, {
    suppressErrors: false,
  })
  async handle(event: UserCreatedDomainEvent): Promise<any> {
    const target = event.email.unpack();

    const token = await this.jwtService.signAsync(
      { confirmEmailUserId: event.aggregateId },
      {
        secret: authConfig.confirmEmailSecret,
        expiresIn: authConfig.confirmEmailExpires,
      },
    );

    const verification = UserVerificationEntity.create({
      userId: event.aggregateId,
      target,
      token,
    });

    await this.userVerificationRepo.insert(verification);
  }
}
