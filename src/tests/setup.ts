
import '@testing-library/jest-dom';

// These type assertions tell TypeScript that jest globals match the expected types
declare global {
  // Properly match jest types
  const jest: typeof import('@jest/globals').jest;
  const describe: jest.Describe;
  const beforeEach: typeof import('@jest/globals').beforeEach;
  const it: jest.It;
  const expect: typeof import('@jest/globals').expect;
}

export {};
