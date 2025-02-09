# pdf-to-png-expect

## Установка пакета
Установка:

``` npm i @rowi-test/pdf-to-png-expect ```

Примечание: для этого пакета требуется Node.js версии 20 или выше.

## О библиотеке

Библиотека помошник для сравнения pdf файлов c помощью библиотеки playwright.
В настоящий момент библиотека playwright не предоставляет таких возможностей, например https://github.com/microsoft/playwright/issues/19253

## Принцип работы
За основу взята библиотека https://github.com/dichovsky/pdf-to-png-converter

1. Настроить параметры конвертации. Это можно сделать в самом тесте или глобально для всего проекта. Например:

playwright.config.ts

```ts
projects : [
  {
    name : "chromium",
    use : {
      ... devices["Desktop Chrome"],
      pdfCompareOptions : {
        disableFontFace : true,
        useSystemFonts : false,
        enableXfa : false,
        viewportScale : 2.0,
        outputFolder : "output/test-files",
        outputFileMaskFunc : (pageNumber) = > `page_${pageNumber}.png`,
        strictPagesToProcess : false,
        verbosityLevel : 0,
      },
    },
  },
],
```

или 

test.spec.ts

```ts
import { test, expect } from "@rowi-test/pdf-to-png-fixture";

test.use({
  pdfCompareOptions : {
    disableFontFace : true,
    useSystemFonts : false,
    enableXfa : false,
    viewportScale : 2.0,
    outputFolder : "output/test-files",
    outputFileMaskFunc : (pageNumber) = > `page_${pageNumber}.png`,
    strictPagesToProcess : false,
    verbosityLevel : 0,
  },
})
```

3. Для начала использования необходимо вызвать фикстуру pdfToPng и передать путь до файла или ArrayBufferLike
4. Затем вызвать утверждение ```await expect(page).toHavePngSnapshot(pngPage)```
5. Построить отчет и сравнить расхождения

Пример использования:

```ts
import { test, expect } from "@rowi-test/pdf-to-png-fixture";

test("pdf is correct", async ({ pdfToPng, page }) => {
	const pngPages = await pdfToPng.convert("./test-data/sample.pdf");

	for (const pngPage of pngPages) await expect(page).toHavePngSnapshot(pngPage);
});
```

Если вы хотите пройтись по всем страницам, то используйте soft               

```ts
await expect.soft(page).toHavePngSnapshot(pngPage);
```
