import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { LoggerPort } from '@src/libs/ports/logger.port';
import { UserVerificationCreatedDomainEvent } from '@src/modules/user/domain/events/user-verification-created.domain-event';

@Injectable()
export class SendVerificationCodeWhenUserVerificationIsCreatedDomainEventHandler {
  constructor(
    @Inject(Logger)
    private readonly logger: LoggerPort,
  ) {}

  @OnEvent(UserVerificationCreatedDomainEvent.name)
  async handle(event: UserVerificationCreatedDomainEvent): Promise<void> {
    this.logger.log(`Verification code: ${event.code}`);
  }
}
