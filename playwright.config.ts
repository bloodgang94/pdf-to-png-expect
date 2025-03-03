import { CompareOptionsConfig } from "@/types";
import { defineConfig, devices } from "@playwright/test";

export default defineConfig<CompareOptionsConfig>({
	testDir: "./tests",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: "html",
	snapshotPathTemplate: "{testDir}/__screenshots__/{testFilePath}/{arg}{ext}",
	use: {
		trace: "on-first-retry",
		pdfToPng: {
			combinePages: false,
			maskRegions: undefined,
			pdf2PngOptions: {
				dpi: undefined,
				disableFontFace: true,
				useSystemFonts: false,
				enableXfa: true,
				strictPagesToProcess: false,
				pdfFilePassword: undefined,
			},
		},
	},

	projects: [
		{
			name: "chromium",
			use: {
				...devices["Desktop Chrome"],
			},
		},
	],
});
