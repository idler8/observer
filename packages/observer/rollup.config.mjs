import { nodeResolve } from '@rollup/plugin-node-resolve';
export default {
  cache: false,
  input: "libs/babel/index.js",
  output: {
    name: 'Observer',
    file: "libs/rollup/index.js",
    format: 'umd'
  },
  plugins: [nodeResolve({ modulePaths: ['libs/babel'], moduleDirectories: [] })]
};