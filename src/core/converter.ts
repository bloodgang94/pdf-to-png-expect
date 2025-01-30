export interface Converter<T extends object> {
	convert(buffer: ArrayBufferLike | string): Promise<T>;
}
