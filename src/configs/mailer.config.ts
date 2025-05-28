import { get } from 'env-var';
import '../libs/utils/dotenv';

export const mailerConfig = {
  transporterType: get('TRANSPORTER_TYPE').required().asString(),
  port: get('MAIL_PORT').asString()
    ? parseInt(get('MAIL_PORT').required().asString(), 10)
    : 587,
  host: get('MAIL_HOST').asString(),
  user: get('MAIL_USER').asString(),
  password: get('MAIL_PASSWORD').asString(),
  defaultEmail: get('MAIL_DEFAULT_EMAIL').asString(),
  defaultName: get('MAIL_DEFAULT_NAME').asString(),
  ignoreTLS: get('MAIL_IGNORE_TLS').required().asString() === 'true',
  secure: get('MAIL_SECURE').required().asString() === 'true',
  requireTLS: get('MAIL_REQUIRE_TLS').required().asString() === 'true',
  verifyTemplatePath: get('VERIFY_TEMPLATE_PATH').asString(),
  forgotPasswordTemplatePath: get('FORGOT_PASSWORD_TEMPLATE_PATH').asString(),
  twoFactorTemplatePath: get('TWO_FACTOR_TEMPLATE_PATH').asString(),
};
