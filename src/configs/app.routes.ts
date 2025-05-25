/**
 * Application routes with its version
 * https://github.com/Sairyss/backend-best-practices#api-versioning
 */

// Root

const usersRoot = 'users';
const authRoot = 'auth';
const bikeRoot = 'bikes';

// Api Versions
const v1 = 'v1';

export const routesV1 = {
  version: v1,
  user: {
    root: usersRoot,
  },
  auth: {
    root: authRoot,
    register: `${authRoot}/register`,
    login: `${authRoot}/login`,
    verify: `${authRoot}/verify`,
  },
  bike: {
    root: bikeRoot,
  },
};
