import { pdf2png } from "@/core/pdf2png/pdf2png";
import { Jimp, JimpInstance } from "jimp";
import { CompareOptions, Dpi } from "@/types";
import { writeImages } from "@/core/imageUtils";
import { PngPageOutput } from "@/types";

/**
 * Represents the available colors for highlighting.
 */
export type HighlightColor = "Red" | "Green" | "Blue" | "White" | "Cyan" | "Magenta" | "Yellow" | "Black" | "Gray";

/**
 * Represents a rectangular mask applied at the PNG level, i.e., after the
 * conversion of the PDF to an image.
 *
 * @remarks
 * The values provided for `x`, `y`, `width`, and `height` are expected to be in
 * pixels and based on the generated image by the library.
 * The origin (0,0) of the PNG's coordinate system is the top-left corner of the
 * image.
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

export type RegionMask = RectangleMask;

/**
 * Defines a function for masking predefined regions per page, useful for
 * parts of the PDF that change between tests.
 *
 * @param page - The page number of the PDF.
 * @returns An array of region masks for the specified page, or undefined if no masks are defined.
 */
export type MaskRegions = (page: number) => ReadonlyArray<RegionMask> | undefined;

const colorToNum: Record<HighlightColor, number> = {
	Red: 0xff0000ff,
	Green: 0x00ff00ff,
	Blue: 0x0000ffff,
	White: 0x00000000,
	Cyan: 0x00ffffff,
	Magenta: 0xff00ffff,
	Yellow: 0xffff00ff,
	Black: 0x000000ff,
	Gray: 0xbfbfbfff,
};

const maskImgWithRegions =
	(maskRegions: MaskRegions) =>
	(images: ReadonlyArray<JimpInstance>): ReadonlyArray<JimpInstance> => {
		images.forEach((img, idx) => {
			(maskRegions(idx + 1) || []).forEach(({ type, x, y, width, height, color }) => {
				if (type === "rectangle-mask") {
					img.composite(new Jimp({ width, height, color: colorToNum[color] }), x, y);
				}
			});
		});

		return images;
	};

/**
 * Compares a PDF to a persisted snapshot, with behavior for handling missing snapshots
 * controlled by the `failOnMissingSnapshot` option.
 *
 * @remarks
 * The function has the following **side effects**:
 * - If no snapshot exists:
 *   - If `failOnMissingSnapshot` is `false` (default), the PDF is converted to an image,
 *     saved as a new snapshot, and the function returns `true`.
 *   - If `failOnMissingSnapshot` is `true`, the function returns `false` without creating a new snapshot.
 * - If a snapshot exists, the PDF is converted to an image and compared to the snapshot:
 *   - If they differ, the function returns `false` and creates two additional images
 *     next to the snapshot: one with the suffix `new` (the current view of the PDF as an image)
 *     and one with the suffix `diff` (showing the difference between the snapshot and the `new` image).
 *   - If they are equal, the function returns `true`. If `new` and `diff` versions are present, they are deleted.
 *
 * @param pdf - Path to the PDF file or a Buffer containing the PDF.
 * @param snapshotDir - Path to the directory where the `__snapshots__` folder will be created.
 * @param snapshotName - Unique name for the snapshot within the specified path.
 * @param options - Options for comparison, including tolerance, mask regions, and behavior
 * regarding missing snapshots. See {@link CompareOptions} for more details.
 *
 * @returns
 * A promise that resolves to `true` if the PDF matches the snapshot or if the behavior
 * allows for missing snapshots. Resolves to `false` if the PDF differs from the snapshot
 * or if `failOnMissingSnapshot` is `true` and no snapshot exists.
 */
export async function comparePdfToSnapshot(
	pdf: string | Buffer,
	snapshotName: string,
	options?: CompareOptions
): Promise<Array<PngPageOutput>> {
	const mergedOptions = mergeOptionsWithDefaults(options);
	const images = await pdf2png(pdf, mergedOptions.pdf2PngOptions)
		.then(maskImgWithRegions(mergedOptions.maskRegions))
		.catch(function (error) {
			throw new Error(error.message);
		});
	return await writeImages(snapshotName, mergedOptions.combinePages)(images);
}

function mergeOptionsWithDefaults(options?: CompareOptions): Required<CompareOptions> {
	return {
		maskRegions: options?.maskRegions ?? (() => []),
		pdf2PngOptions: options?.pdf2PngOptions?.dpi
			? { ...options?.pdf2PngOptions }
			: { ...options?.pdf2PngOptions, dpi: Dpi.High },
		combinePages: options?.combinePages ?? false,
	};
}
