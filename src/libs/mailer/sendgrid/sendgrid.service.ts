import { TransporterService } from '../transporter.service';
import { EmailBuilder } from './utils/email-builder';
import { TemplateResolver } from './utils/template-resolver';
import { MailType } from '../enum';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { lastValueFrom } from 'rxjs';
import { mailerConfig } from '@src/configs/mailer.config';
import { ArgumentNotProvidedException } from '@src/libs/exceptions';

@Injectable()
export class SendgridService extends TransporterService {
  constructor(
    private readonly templateResolver: TemplateResolver,
    private readonly client: HttpService,
  ) {
    super();
  }

  async sendMail(
    toEmail: string,
    toName: string,
    mailType: MailType,
    options?: Record<string, any>,
  ): Promise<void> {
    if (!toEmail) {
      console.warn('Email is required: ', toEmail);
    }

    if (!mailerConfig.defaultEmail || !mailerConfig.defaultName) {
      throw new ArgumentNotProvidedException(
        'Please set default email and name',
      );
    }

    const builder = new EmailBuilder()
      .setFrom(mailerConfig.defaultEmail, mailerConfig.defaultName)
      .addPersonalization(toName, toEmail, options);

    const templateId = this.templateResolver.getTemplateId(mailType);
    builder.setTemplateId(templateId);

    const payload = builder.build();

    try {
      await lastValueFrom(this.client.post('/mail/send', payload));
      if (process.env.NODE_ENV !== 'production') {
        console.log(`Email sent ${toEmail}`);
      }
    } catch (error) {
      console.warn(`Failed to send email to ${toEmail} `, error);
    }
  }
}
