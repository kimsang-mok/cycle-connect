declare global {
  namespace NodeJS {
    interface Global {
      __TEST_CONTEXT__?: any;
    }
  }
}
