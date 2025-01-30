import { test, expect } from "../src/fixture/pdf-to-png-fixture";

test.describe(() => {
	test("pdf is correct", async ({ pdfToPng, page }) => {
		const pngPages = await pdfToPng.convert("./test-data/sample.pdf");

		for (const pngPage of pngPages) await expect(page).toHavePngSnapshot(pngPage);
	});
});
