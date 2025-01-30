import { defineConfig } from "tsup";

export default defineConfig({
	dts: {
		resolve: true,
	},
	bundle: true,
	treeshake: true,
	sourcemap: false,
	platform: "node",
	target: "esnext",
	splitting: true,
	format: ["esm", "cjs"],
	clean: true,
	entry: ["src/**/*.ts"],
	entryPoints: ["src/index.ts"],
});
