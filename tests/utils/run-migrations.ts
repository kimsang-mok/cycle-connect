import { execSync } from 'child_process';

export function runMigrations() {
  execSync(`ts-node database/migrate up`, {
    stdio: 'inherit',
    env: {
      ...process.env,
      DB_HOST: process.env.DB_HOST,
      DB_PORT: process.env.DB_PORT,
    },
  });
}
