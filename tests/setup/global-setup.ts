import { createTestContext } from '../../test-container/core/create-test-context';
import { runMigrations } from '../utils/run-migrations';
import { runSeeds } from '../utils/run-seeds';
import '../../test-container/preset/postgres';
import * as dotenv from 'dotenv';
import * as path from 'path';

const envPath = path.resolve(__dirname, '../../.env.test');
dotenv.config({ path: envPath });

const context = createTestContext([
  {
    name: 'postgres',
    options: {
      username: 'postgres',
      password: 'postgres',
      database: 'test_db',
      port: 5432,
    },
  },
]);

globalThis.__TEST_CONTEXT__ = context;

export default async () => {
  await context.startAll();
  const pg = context.getContainer('postgres');

  process.env.DB_HOST = pg.getHost();
  process.env.DB_PORT = pg.getMappedPort(5432).toString();

  runMigrations();

  runSeeds();
};
