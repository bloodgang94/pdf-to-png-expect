/* eslint-disable @typescript-eslint/no-explicit-any */
import { comparePdfToSnapshot } from "@/core/compare-pdf-to-snapshot";
import { expect as baseExpect, test as baseTest } from "@playwright/test";
import { CompareOptions } from "@/types";

export const expect = baseExpect.extend({
	async toMatchPdfSnapshot(
		pdf: string | Buffer,
		options?: CompareOptions & {
			maxDiffPixelRatio?: number;
			maxDiffPixels?: number;
			name?: string | Array<string>;
			threshold?: number;
		}
	) {
		const assertionName = "toMatchPdfSnapshot";
		let pass = true;
		const testInfo = baseTest.info();
		const projectOptions = (testInfo.project.use as any).pdfToPng as CompareOptions;

		const snapshotName = testInfo.title.split(" ").join("_");
		let matcherResult: any;

		try {
			const array = await comparePdfToSnapshot(pdf, snapshotName, { ...projectOptions, ...options });
			for (const pngPage of array) {
				baseExpect.soft(pngPage.content).toMatchSnapshot(options);
			}
		} catch (e: any) {
			matcherResult = e.matcherResult ?? e;
			pass = false;
		}

		const message = () => matcherResult;

		return {
			message,
			pass,
			name: assertionName,
			actual: matcherResult?.actual,
		};
	},
});

export * from "@playwright/test";
