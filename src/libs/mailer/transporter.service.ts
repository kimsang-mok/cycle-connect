import { MailType } from './enum';

export abstract class TransporterService {
  abstract sendMail(
    toEmail: string,
    toName: string,
    mailType: MailType,
    options?: Record<string, any>,
  ): Promise<void>;
}
