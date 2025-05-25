import { Module, Provider } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ContextInterceptor } from './libs/application/context/ContextInterceptor';
import { ExceptionInterceptor } from './libs/application/interceptors/exception.interceptor';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RequestContextModule } from 'nestjs-request-context';
import { SlonikModule } from 'nestjs-slonik';
import { postgresConnectionUri } from './configs/database.config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { NotificationModule } from './modules/notification/notification.module';
import { CqrsModule } from '@nestjs/cqrs';
import { BikeModule } from './modules/bike/bike.module';

const interceptors: Provider[] = [
  {
    provide: APP_INTERCEPTOR,
    useClass: ContextInterceptor,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: ExceptionInterceptor,
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
  ],
  controllers: [],
  providers: [...interceptors],
})
export class AppModule {}
