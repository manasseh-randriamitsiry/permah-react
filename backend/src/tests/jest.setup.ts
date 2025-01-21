import '@jest/globals';

// This makes TypeScript recognize Jest globals
declare global {
  namespace jest {
    interface Context {
      [key: string]: any;
    }
  }
} 