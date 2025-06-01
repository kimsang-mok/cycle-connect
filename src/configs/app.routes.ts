/**
 * Application routes with its version
 * https://github.com/Sairyss/backend-best-practices#api-versioning
 */

// Root

const usersRoot = 'users';
const authRoot = 'auth';
const bikeRoot = 'bikes';
const bookingRoot = 'bookings';
const uploadRoot = 'uploads';

// Api Versions
const v1 = 'v1';

export const routesV1 = {
  version: v1,
  user: {
    tag: 'User',
    root: usersRoot,
  },
  auth: {
    tag: 'Auth',
    root: authRoot,
    register: `${authRoot}/register`,
    login: `${authRoot}/login`,
    verify: `${authRoot}/verify`,
    refresh: `${authRoot}/refresh`,
  },
  bike: {
    tag: 'Bike',
    root: bikeRoot,
    activate: `${bikeRoot}/:id/activate`,
    deactivate: `${bikeRoot}/:id/deactivate`,
  },
  booking: {
    tag: 'Booking',
    root: bookingRoot,
  },
  upload: {
    tag: 'Upload',
    presign: `${uploadRoot}/presign`,
  },
};
