import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ["react", "react-dom", "dexie"],
  esbuildOptions(options) {
    options.banner = {
      js: "/**\n * Advanced Logger\n * A flexible and powerful logging library for JavaScript applications\n * @license MIT\n */",
    }
  },
})
