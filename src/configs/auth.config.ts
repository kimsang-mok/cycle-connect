import { get } from 'env-var';
import '../libs/utils/dotenv';

export const authConfig = {
  secret: get('AUTH_JWT_SECRET').required().asString(),
  expires: get('AUTH_JWT_TOKEN_EXPIRES_IN').required().asString(),
  refreshSecret: get('AUTH_REFRESH_SECRET').required().asString(),
  refreshExpires: get('AUTH_REFRESH_TOKEN_EXPIRES_IN').required().asString(),
  forgotSecret: get('AUTH_FORGOT_SECRET').required().asString(),
  forgotExpires: get('AUTH_FORGOT_TOKEN_EXPIRES_IN').required().asString(),
  confirmEmailSecret: get('AUTH_CONFIRM_EMAIL_SECRET').required().asString(),
  confirmEmailExpires: get('AUTH_CONFIRM_EMAIL_TOKEN_EXPIRES_IN')
    .required()
    .asString(),
  cookiesExpires: get('COOKIES_EXPIRES_IN').required().asString(),
};
