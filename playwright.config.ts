import { defineConfig, devices } from "@playwright/test";
import { PdfCompareOptions } from "./src/fixture/pdf-to-png-fixture";

export default defineConfig<PdfCompareOptions>({
	testDir: "./tests",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: "html",
	use: {
		trace: "on-first-retry",
	},

	projects: [
		{
			name: "chromium",
			use: {
				...devices["Desktop Chrome"],
				pdfCompareOptions: {
					disableFontFace: true, // When `false`, fonts will be rendered using a built-in font renderer that constructs the glyphs with primitive path commands. Default value is true.
					useSystemFonts: false, // When `true`, fonts that aren't embedded in the PDF document will fallback to a system font. Default value is false.
					enableXfa: false, // Render Xfa forms if any. Default value is false.
					viewportScale: 2.0, // The desired scale of PNG viewport. Default value is 1.0 which means to display page on the existing canvas with 100% scale.
					outputFolder: "output/test-files", // Folder to write output PNG files. If not specified, PNG output will be available only as a Buffer content, without saving to a file.
					outputFileMaskFunc: (pageNumber) => `page_${pageNumber}.png`, // Output filename mask function. Example: (pageNumber) => `page_${pageNumber}.png`
					pdfFilePassword: undefined, // Password for encrypted PDF.
					pagesToProcess: undefined, // Subset of pages to convert (first page = 1), other pages will be skipped if specified.
					strictPagesToProcess: false, // When `true`, will throw an error if specified page number in pagesToProcess is invalid, otherwise will skip invalid page. Default value is false.
					verbosityLevel: 0, // Verbosity level. ERRORS: 0, WARNINGS: 1, INFOS: 5. Default value is 0.
				},
			},
		},
	],
});
