import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MailType } from '@src/libs/mailer/enum';
import { TransporterService } from '@src/libs/mailer/transporter.service';
import { LoggerPort } from '@src/libs/ports/logger.port';
import { UserVerificationCreatedDomainEvent } from '@src/modules/auth/domain/events/user-verification-created.domain-event';

@Injectable()
export class SendVerificationCodeWhenUserVerificationIsCreatedDomainEventHandler {
  constructor(
    @Inject(Logger)
    private readonly logger: LoggerPort,
    private readonly transporterService: TransporterService,
  ) {}

  @OnEvent(UserVerificationCreatedDomainEvent.name)
  async handle(event: UserVerificationCreatedDomainEvent): Promise<void> {
    this.logger.log(`Token: ${event.token}`);

    const url = new URL('http://localhost:3000/v1/auth/confirm-email');
    url.searchParams.set('token', event.token);

    await this.transporterService.sendMail(
      event.target,
      'Mocked User',
      MailType.VERIFY_EMAIL,
      { url },
    );
  }
}
