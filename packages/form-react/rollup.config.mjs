import { nodeResolve } from '@rollup/plugin-node-resolve';
import dts from 'rollup-plugin-dts'
import terser from '@rollup/plugin-terser';

export default [{
  cache: false,
  input: "libs/babel/index.js",
  output: {
    name: 'ReactObserver',
    file: "libs/rollup/index.js",
    format: 'umd',
    globals: {
      react: 'React'
    },
  },
  plugins: [nodeResolve({ modulePaths: ['libs/babel'], moduleDirectories: [] }), terser()]
}, {
  input: "libs/typings/index.d.ts",
  output: [{ file: "libs/rollup/index.d.ts", format: "es" }],
  plugins: [
    nodeResolve({
      extensions: [".tsx", ".ts", ".jsx", ".js", ".json", '.d.ts'],
      modulePaths: ['libs/typings'],
      moduleDirectories: []
    }),
    dts()],
}];