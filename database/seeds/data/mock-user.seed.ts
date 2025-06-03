import { sql } from 'slonik';
import { getPool } from '../seed-helper';

export async function seedMockUser() {
  const pool = await getPool();

  const userId = '84b34736-2cf5-4a12-81e2-d58cbb0701ec';

  await pool.query(sql`
    INSERT INTO users (id, email, password, role, "createdAt", "updatedAt")
    VALUES (
      ${userId},
      'renter@example.com',
      '$2b$10$7ZtrQU0wU1x9nA0Bv5hV8ep0nDUbDJWPAHhLLM4Ye7zn8gpxmJXc2', -- bcrypt hash for "password123"
      'renter',
      NOW(),
      NOW()
    ) ON CONFLICT (id) DO NOTHING
  `);
}
