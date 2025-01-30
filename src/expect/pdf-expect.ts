import { expect as baseExpect } from "@playwright/test";
import type { Page } from "@playwright/test";
import { PngPageOutput } from "pdf-to-png-converter";

export const expect = baseExpect.extend({
	/**
	 * Compares the request body with json
	 *
	 * **Usage**
	 *
	 * ```js
	 * const pngPages = await pngToPdf.convert(await res.body());
	 *   for (const pngPage of pngPages) await expect.soft(page).toHavePngSnapshot(pngPage);
	 * ```
	 * @param {Object} page - Page playwright.
	 * @param {Object} pngPage - page PngPageOutput
	 * @param {Object} options - options
	 */
	async toHavePngSnapshot(
		page: Page,
		pngPage: PngPageOutput,
		options?: {
			maxDiffPixelRatio?: number;
			maxDiffPixels?: number;
			name?: string | Array<string>;
			threshold?: number;
		}
	) {
		const assertionName = "toHavePngSnapshot";
		let pass: boolean;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let matcherResult: any;
		try {
			await page.setViewportSize({ width: Math.round(pngPage.width), height: Math.round(pngPage.height) });
			await page.goto("file:///" + pngPage.path, { waitUntil: "load" });
			baseExpect(await page.locator("//img").screenshot()).toMatchSnapshot(options);

			pass = true;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			matcherResult = e.matcherResult;
			pass = false;
		}

		const message = () => matcherResult.message;

		return {
			message,
			pass,
			name: assertionName,
			pngPage,
			actual: matcherResult?.actual,
		};
	},
});
