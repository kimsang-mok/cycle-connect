import { seedMockUser } from './data/mock-user.seed';

export async function runAllSeeds() {
  await seedMockUser();
}
