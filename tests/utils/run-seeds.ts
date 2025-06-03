import { execSync } from 'child_process';

export function runSeeds() {
  execSync(`ts-node database/seeds/seed-runner.ts`, {
    stdio: 'inherit',
    env: {
      ...process.env,
      DB_HOST: process.env.DB_HOST,
      DB_PORT: process.env.DB_PORT,
    },
  });
}
