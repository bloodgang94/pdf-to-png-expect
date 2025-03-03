import { Canvas } from "@napi-rs/canvas";
import * as fs from "node:fs/promises";
import { Jimp, JimpInstance } from "jimp";
import type { PDFDocumentProxy, PDFPageProxy, PageViewport } from "pdfjs-dist";
import { PdfToPngOptions, Dpi } from "@/types";
import { convertFromMmToPx, convertFromPxToMm } from "@/core/conversions/conversions";
import { NodeCanvasFactory } from "./node.canvas.factory";
import { propsToPdfDocInitParams } from "@/core/propsToPdfDocInitParams";

/**
 * default dpi
 *
 * @type {72}
 */
const PDF_DPI = 72;
/**
 * Get scale
 *
 * @param {PDFPageProxy} page
 * @param {(Dpi | number)} dpi
 * @returns {PageViewport}
 */
function getPageViewPort(page: PDFPageProxy, dpi: Dpi | number): PageViewport {
	const dpiNum = dpi === Dpi.Low ? PDF_DPI : dpi === Dpi.High ? 144 : dpi;
	const viewport = page.getViewport({ scale: 1.0 });
	if (dpiNum === PDF_DPI) {
		return viewport;
	}

	const horizontalMm = convertFromPxToMm(viewport.width, PDF_DPI);
	const verticalMm = convertFromPxToMm(viewport.height, PDF_DPI);
	const actualWidth = convertFromMmToPx(horizontalMm, dpiNum);
	const actualHeight = convertFromMmToPx(verticalMm, dpiNum);
	const scale = Math.min(actualWidth / viewport.width, actualHeight / viewport.height);

	return page.getViewport({ scale });
}

/**
 * Render pdf
 *
 * @param {PDFDocumentProxy} pdfDocument
 * @param {(Dpi | number)} dpi
 * @returns {<T>(toImage: (canvas: Canvas) => T, toJimpInstances: (images: Array<T>) => Promise<ReadonlyArray<JimpInstance>>) => Promise<ReadonlyArray<JimpInstance>>}
 */
function mkPdfPagesRenderer(pdfDocument: PDFDocumentProxy, dpi: Dpi | number) {
	return async function <T>(
		toImage: (canvas: Canvas) => T,
		toJimpInstances: (images: Array<T>) => Promise<ReadonlyArray<JimpInstance>>
	): Promise<ReadonlyArray<JimpInstance>> {
		const images: Array<T> = [];
		const totalPages = pdfDocument.numPages;

		for (let idx = 1; idx <= totalPages; idx++) {
			const page = await pdfDocument.getPage(idx);

			const viewport = getPageViewPort(page, dpi);
			const canvasFactory = new NodeCanvasFactory();
			const { canvas, context } = canvasFactory.create(viewport.width, viewport.height);

			await page.render({ canvasContext: context as unknown as CanvasRenderingContext2D, viewport }).promise;
			images.push(toImage(canvas));
			page.cleanup();
			canvasFactory.destroy({ canvas, context });
		}

		return toJimpInstances(images);
	};
}

/**
 * Convert pdf to png
 *
 * @export
 * @async
 * @param {(string | Buffer)} pdf
 * @param {PdfToPngOptions} [options={}]
 * @returns {Promise<ReadonlyArray<JimpInstance>>}
 */
export async function pdf2png(
	pdf: string | Buffer,
	options: PdfToPngOptions = {}
): Promise<ReadonlyArray<JimpInstance>> {
	const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");

	const pdf2PngDefOpts: Required<Pick<PdfToPngOptions, "dpi">> & PdfToPngOptions = {
		dpi: Dpi.High,
	};

	const opts = {
		...pdf2PngDefOpts,
		...options,
	};

	const pdfBuffer = Buffer.isBuffer(pdf) ? pdf : await fs.readFile(pdf);
	const documentInitParameters = propsToPdfDocInitParams(opts);
	const loadingTask = getDocument({
		...documentInitParameters,
		data: new Uint8Array(pdfBuffer),
	});

	const pdfDocument = await loadingTask.promise;
	const renderPdfPages = mkPdfPagesRenderer(pdfDocument, opts.dpi);

	return renderPdfPages(
		(canvas) => canvas.toBuffer("image/png"),
		(images) => Promise.all(images.map((x) => Jimp.read(x).then((x) => x as JimpInstance)))
	);
}
