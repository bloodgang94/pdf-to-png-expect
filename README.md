# pdf-to-png-expect

## Технологии

## Принцип работы

Пример использования:

```ts
import { test, expect } from "@rowi-test/pdf-to-png-fixture";

test("pdf is correct", async ({ pdfToPng, page }) => {
	const pngPages = await pdfToPng.convert("./test-data/sample.pdf");

	for (const pngPage of pngPages) await expect(page).toHavePngSnapshot(pngPage);
});
```
