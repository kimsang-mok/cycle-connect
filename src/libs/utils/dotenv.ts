import { config } from 'dotenv';
import * as path from 'path';

const envPath: string = path.resolve(
  __dirname,
  process.env.NODE_ENV === 'test'
    ? './../../../../.env.test'
    : './../../../../.env',
);

config({ path: envPath });
