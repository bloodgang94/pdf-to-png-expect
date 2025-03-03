import { JimpInstance } from "jimp";
import { mergeImages } from "@/core/imageUtils/mergeImages";
import { PngPageOutput } from "@/types/png.page.output";

/**
 * Writes images to the specified output path.
 *
 * @returns {Array<PngPageOutput>} A function that takes an array of Jimp images and returns a promise.
 * @param {string} expectedName
 * @param {boolean} [combinePages=true] combinePages
 */
export const writeImages =
	(
		/** The path where the images will be saved. */
		expectedName: string,
		/**
		 * Whether to combine all images into a single image.
		 * @defaultValue true
		 */
		combinePages = true
	) =>
	async (images: ReadonlyArray<JimpInstance>): Promise<Array<PngPageOutput>> => {
		if (combinePages === true) {
			const image = mergeImages(images);
			return Promise.resolve([
				{
					name: expectedName,
					pageNumber: 1,
					content: await image.getBuffer("image/png"),
					width: image.width,
					height: image.height,
				},
			]);
		}

		const padMaxLen = images.length.toString().length;
		const imagesArray: Array<PngPageOutput> = [];
		images.map(async (img, idx) => {
			const fileName: `${string}.${string}` = `${expectedName}_${String(idx + 1).padStart(padMaxLen, "0")}.png`;
			imagesArray.push({
				name: fileName,
				pageNumber: idx + 1,
				content: await img.getBuffer("image/png"),
				width: img.width,
				height: img.height,
			});
		});
		return Promise.resolve(imagesArray);
	};
