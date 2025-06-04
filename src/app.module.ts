import { Module, Provider } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ContextInterceptor } from './libs/application/context/ContextInterceptor';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RequestContextModule } from 'nestjs-request-context';
import { SlonikModule } from 'nestjs-slonik';
import { postgresConnectionUri } from './configs/database.config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { NotificationModule } from './modules/notification/notification.module';
import { CqrsModule } from '@nestjs/cqrs';
import { BikeModule } from './modules/bike/bike.module';
import { BookingModule } from './modules/booking/booking.module';
import { FileModule } from './modules/file/file.module';
import { DomainExceptionFilter } from './libs/application/filters/domain-exception.filter';
import { AllExceptionsFilter } from './libs/application/filters/all-exception.filter';
import { ValidationExceptionFilter } from './libs/application/filters/validation-exception.filter';

const interceptors: Provider[] = [
  {
    provide: APP_INTERCEPTOR,
    useClass: ContextInterceptor,
  },
];

const filters: Provider[] = [
  {
    provide: APP_FILTER,
    useClass: AllExceptionsFilter,
  },
  {
    provide: APP_FILTER,
    useClass: ValidationExceptionFilter,
  },
  {
    provide: APP_FILTER,
    useClass: DomainExceptionFilter,
  },
];

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    RequestContextModule,
    SlonikModule.forRoot({ connectionUri: postgresConnectionUri }),
    CqrsModule,

    // Modules
    AuthModule,
    UserModule,
    NotificationModule,
    BikeModule,
    BookingModule,
    FileModule,
  ],
  controllers: [],
  providers: [...interceptors, ...filters],
})
export class AppModule {}
