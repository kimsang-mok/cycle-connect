export default async () => {
  if (globalThis.__TEST_CONTEXT__) {
    await globalThis.__TEST_CONTEXT__.stopAll();
  }
};
