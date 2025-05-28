import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { mailerConfig } from '@src/configs/mailer.config';
import { TransporterService } from '../transporter.service';
import { SendgridService } from './sendgrid.service';
import { TemplateResolver } from './utils/template-resolver';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        baseUrl: mailerConfig.host,
        headers: {
          Authorization: `Bearer ${mailerConfig.password}`,
        },
      }),
    }),
  ],
  providers: [
    {
      provide: TransporterService,
      useClass: SendgridService,
    },
    TemplateResolver,
  ],
  exports: [TransporterService],
})
export class SendgridModule {}
