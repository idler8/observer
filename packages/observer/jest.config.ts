import type { JestConfigWithTsJest } from 'ts-jest'
const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleDirectories: ["node_modules", "src"],
};
export default jestConfig;