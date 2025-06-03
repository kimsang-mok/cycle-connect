import * as dotenv from 'dotenv';
import * as path from 'path';
import { runAllSeeds } from './index';

const envPath = path.resolve(
  __dirname,
  process.env.NODE_ENV === 'test' ? '../../.env.test' : '../../.env',
);
dotenv.config({ path: envPath });

runAllSeeds()
  .then(() => {
    console.log('[Seeding] All seeds executed successfully');
    process.exit(0);
  })
  .catch((err) => {
    console.error('[Seeding Error]', err);
    process.exit(1);
  });
