import { Logger, Module } from '@nestjs/common';

import { SendVerificationCodeWhenUserVerificationIsCreatedDomainEventHandler } from './event-handlers/send-verification-code-when-user-is-created.domain-event-handler';

const eventHandlers = [
  SendVerificationCodeWhenUserVerificationIsCreatedDomainEventHandler,
];

@Module({
  imports: [],
  controllers: [],
  providers: [Logger, ...eventHandlers],
})
export class NotificationModule {}
