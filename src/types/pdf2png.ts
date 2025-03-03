/**
 * Enum representing predefined DPI (Dots Per Inch) values.
 */
export enum Dpi {
	Low = 72,
	High = 144,
}

/**
 * Configuration options for converting a PDF to PNG format.
 */
export type PdfToPngOptions = {
	dpi?: Dpi | number;
	disableFontFace?: boolean;
	useSystemFonts?: boolean;
	enableXfa?: boolean;
	pdfFilePassword?: string;
	strictPagesToProcess?: boolean;
	pagesToProcess?: number[];
	verbosityLevel?: number;
};

/**
 * RectangleMask
 *
 * @export
 * @typedef {RectangleMask}
 */
export type RectangleMask = Readonly<{
	type: "rectangle-mask";
	/** The x-coordinate of the top-left corner of the rectangle in pixels. */
	x: number;
	/** The y-coordinate of the top-left corner of the rectangle in pixels. */
	y: number;
	/** The width of the rectangle in pixels. */
	width: number;
	/** The height of the rectangle in pixels. */
	height: number;
	/** The color used for the mask. */
	color: HighlightColor;
}>;

/**
 * HighlightColor
 *
 * @export
 * @typedef {HighlightColor}
 */
export type HighlightColor = "Red" | "Green" | "Blue" | "White" | "Cyan" | "Magenta" | "Yellow" | "Black" | "Gray";

/**
 * RegionMask
 *
 * @export
 * @typedef {RegionMask}
 */
export type RegionMask = RectangleMask;
