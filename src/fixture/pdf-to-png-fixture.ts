import { PdfToPng } from "@/core/pdfToPng";
import { test as base } from "@playwright/test";
import { PdfToPngOptions } from "pdf-to-png-converter";

export interface PdfCompareFixture {
	pdfToPng: PdfToPng;
}

export interface PdfCompareOptions {
	pdfCompareOptions: PdfToPngOptions;
}

export const pdfCompareFixture = base.extend<PdfCompareFixture & PdfCompareOptions>({
	pdfCompareOptions: [
		{
			disableFontFace: true,
			useSystemFonts: false,
			enableXfa: false,
			viewportScale: 2.0,
			outputFolder: "output/folder",
			outputFileMaskFunc: (pageNumber) => `page_${pageNumber}.png`,
			strictPagesToProcess: false,
			verbosityLevel: 0,
		},
		{ option: true },
	],
	pdfToPng: async ({ pdfCompareOptions }, use) => {
		const pdfToPng = new PdfToPng(pdfCompareOptions);
		await use(pdfToPng);
	},
});

export { expect } from "@/expect/pdf-expect";
