import { defineConfig } from "tsup";

export default defineConfig({
	dts: {
		resolve: true,
	},
	bundle: true,
	minify: false,
	treeshake: true,
	sourcemap: false,
	platform: "node",
	outDir: "dist/",
	target: "esnext",
	splitting: true,
	format: ["esm", "cjs"],
	clean: true,
	entry: ["src/**/*.ts"],
	entryPoints: ["src/index.ts"],
	outExtension({ format }) {
		return {
			dts: ".d.ts",
			js: format === "cjs" ? ".cjs" : ".mjs",
		};
	},
});
