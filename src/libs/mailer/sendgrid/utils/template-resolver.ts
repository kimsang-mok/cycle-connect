import { Injectable } from '@nestjs/common';
import { mailerConfig } from '@src/configs/mailer.config';
import { MailType } from '../../enum';

@Injectable()
export class TemplateResolver {
  private templateMap: Record<MailType, string | undefined>;

  constructor() {
    this.templateMap = {
      VERIFY_EMAIL: mailerConfig.verifyTemplatePath,
      FORGOT_PASSWORD_EMAIL: mailerConfig.forgotPasswordTemplatePath,
      TWO_FACTOR_EMAIL: mailerConfig.twoFactorTemplatePath,
    };
  }

  getTemplateId(mailType: MailType): string {
    return this.templateMap[mailType] || 'default';
  }
}
