import { Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserCreatedDomainEvent } from '../domain/events/user-created.domain-event';
import { UserVerificationRepository } from '../database/adapters/user-verification.repository';
import { USER_VERIFICATION_REPOSITORY } from '../user.di-tokens';
import { UserVerificationEntity } from '../domain/user-verification.entity';

export class CreateUserVerificationWhenUserIsCreatedDomainEventHandler {
  constructor(
    @Inject(USER_VERIFICATION_REPOSITORY)
    private readonly userVerificationRepo: UserVerificationRepository,
  ) {}

  @OnEvent(UserCreatedDomainEvent.name, {
    suppressErrors: false,
  })
  async handle(event: UserCreatedDomainEvent): Promise<any> {
    const target = event.email?.unpack() ?? event.phone?.unpack();

    const verification = UserVerificationEntity.create(
      event.aggregateId,
      target!,
    );
    await this.userVerificationRepo.insert(verification);
  }
}
