import { PngPageOutput, pdfToPng } from "pdf-to-png-converter";
import { Converter } from "./converter";
import { PdfToPngOptions } from "pdf-to-png-converter";

export class PdfToPng implements Converter<Array<PngPageOutput>> {
	constructor(readonly options: PdfToPngOptions) {}
	/**
	 * Convert pdf to pnf
	 *
	 * @param {string|Buffer} buffer - Path to pdf file or buffer.
	 */
	async convert(buffer: string | ArrayBufferLike): Promise<Array<PngPageOutput>> {
		const pngPages = await pdfToPng(buffer, this.options);
		return pngPages;
	}
}
