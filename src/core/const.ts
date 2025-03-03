import path from "path";
import { DocumentInitParameters } from "pdfjs-dist/types/src/display/api";

const PDFJS_DIR = path.join(path.dirname(require.resolve("pdfjs-dist")), "..");

export const DOCUMENT_INIT_PARAMS_DEFAULTS: DocumentInitParameters = {
	standardFontDataUrl: path.join(PDFJS_DIR, "standard_fonts/"),
	cMapUrl: path.join(PDFJS_DIR, "cmaps/"),
	cMapPacked: true,
};

export const PDF_TO_PNG_OPTIONS_DEFAULTS = {
	viewportScale: 1,
	disableFontFace: true,
	useSystemFonts: false,
	enableXfa: true,
	outputFileMask: "buffer",
	strictPagesToProcess: false,
	pdfFilePassword: undefined,
};
