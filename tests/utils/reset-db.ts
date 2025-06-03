import { createPool, sql } from 'slonik';

import * as dotenv from 'dotenv';
import * as path from 'path';

const envPath = path.resolve(__dirname, '../../.env.test');
dotenv.config({ path: envPath });

export async function resetDatabase() {
  const pool = await createPool(
    `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  );

  await pool.connect(async (conn) => {
    await conn.query(sql`TRUNCATE TABLE bikes RESTART IDENTITY CASCADE`);
    await conn.query(sql`TRUNCATE TABLE users RESTART IDENTITY CASCADE`);
    await conn.query(
      sql`TRUNCATE TABLE user_verifications RESTART IDENTITY CASCADE`,
    );
    await conn.query(sql`TRUNCATE TABLE sessions RESTART IDENTITY CASCADE`);
    await conn.query(sql`TRUNCATE TABLE bookings RESTART IDENTITY CASCADE`);
  });
}
