import { MaskRegions } from "@/core/compare-pdf-to-snapshot";
import { PdfToPngOptions } from "./pdf2png";

/**
 * The options type for {@link comparePdfToSnapshot}.
 *
 * @privateRemarks
 * Explicitly not using `Partial`. It doesn't play nice with TypeDoc.
 * Instead of showing the type name in the docs a Partial with all the
 * fields is inlined.
 */
export type CompareOptions = {
	combinePages?: boolean;
	/** {@inheritDoc MaskRegions} */
	maskRegions?: MaskRegions;
	/** {@inheritDoc PdfToPngOptions} */
	pdf2PngOptions?: PdfToPngOptions;
};

/**
 * The options type for playwright.config.ts
 *
 */
export type CompareOptionsConfig = {
	pdfToPng: CompareOptions;
};
