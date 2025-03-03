/* eslint-disable no-empty-pattern */
import { test, expect } from "../src/expect/pdf-expect";
import { Dpi, RegionMask } from "../src/types";

const file = "./test-data/sample.pdf";
const file_protected = "./test-data/sample-protected.pdf";

const mask: RegionMask = {
	type: "rectangle-mask",
	x: 50,
	y: 75,
	width: 140,
	height: 100,
	color: "Blue",
};

test.describe(() => {
	test("should succeed comparing masked pdf", async ({}) => {
		await expect(file).toMatchPdfSnapshot({
			combinePages: false,
			maskRegions: () => [mask],
		});
	});

	test("should mask only second page of the pdf", async ({}) => {
		await expect(file).toMatchPdfSnapshot({
			combinePages: false,
			maskRegions: (page: number) => (page === 2 ? [mask] : undefined),
		});
	});

	test("protected file opens successfully", async ({}) => {
		await expect(file_protected).toMatchPdfSnapshot({ pdf2PngOptions: { pdfFilePassword: "password" } });
	});

	test("should convert all options", async ({}) => {
		await expect(file).toMatchPdfSnapshot({
			combinePages: false,
			maskRegions: (page: number) => (page === 2 ? [mask] : undefined),
			pdf2PngOptions: {
				dpi: Dpi.Low,
				disableFontFace: true,
				useSystemFonts: false,
				enableXfa: true,
				strictPagesToProcess: false,
				pdfFilePassword: undefined,
			},
			maxDiffPixels: 1,
		});
	});

	[Dpi.Low, Dpi.High].forEach((dpi) => {
		test(`should handle dpi ${dpi} parameter`, async ({}) => {
			await expect(file).toMatchPdfSnapshot({
				pdf2PngOptions: {
					dpi,
				},
				maxDiffPixels: 100,
			});
		});
	});
});
