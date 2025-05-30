import { Logger, Module } from '@nestjs/common';

import { SendVerificationCodeWhenUserVerificationIsCreatedDomainEventHandler } from './event-handlers/send-verification-code-when-user-is-created.domain-event-handler';
import { SendgridModule } from '@src/libs/mailer/sendgrid/sendgrid.module';

const eventHandlers = [
  SendVerificationCodeWhenUserVerificationIsCreatedDomainEventHandler,
];

@Module({
  imports: [SendgridModule],
  controllers: [],
  providers: [Logger, ...eventHandlers],
})
export class NotificationModule {}
