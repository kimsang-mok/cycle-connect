import { TestContext } from './test-context';
import { ContainerConfig } from './types';

/**
 * create a new test context with container configs
 * @param configs
 * @returns
 */
export function createTestContext(configs: ContainerConfig[]) {
  return new TestContext(configs);
}
