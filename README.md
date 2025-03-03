# pdf-to-png-expect

## Установка пакета

Установка:

`npm i @rowi-test/pdf-to-png-expect`

Примечание: для этого пакета требуется Node.js версии 20 или выше.

## О библиотеке

Библиотека помощник для сравнения pdf файлов c помощью библиотеки playwright.
В настоящий момент библиотека playwright не предоставляет таких возможностей, например https://github.com/microsoft/playwright/issues/19253

## Использование

1. Настроить параметры конвертации. Это можно сделать в самом тесте или глобально для всего проекта. Например:

playwright.config.ts

```ts
import { CompareOptionsConfig, Dpi } from "@/types";

export default defineConfig<CompareOptionsConfig>({
	testDir: "./tests",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: "html",
	snapshotPathTemplate: "{testDir}/__screenshots__/{testFilePath}/{arg}{ext}",
	use: {
		trace: "on-first-retry",
		pdfToPng: {
			combinePages: false,
			maskRegions: undefined,
			pdf2PngOptions: {
				dpi: Dpi.Low,
				disableFontFace: true,
				useSystemFonts: false,
				enableXfa: true,
				strictPagesToProcess: false,
				pdfFilePassword: undefined,
			},
		},
	},

	projects: [
		{
			name: "chromium",
			use: {
				...devices["Desktop Chrome"],
			},
		},
	],
});
```

или передать их во время теста

test.spec.ts

```ts
import { test, expect } from "@rowi-test/pdf-to-png-fixture";

test("should convert all options", async ({}) => {
	await expect(file).toMatchPdfSnapshot({
		combinePages: false,
		maskRegions: (page: number) => (page === 2 ? [mask] : undefined),
		pdf2PngOptions: {
			dpi: Dpi.Low,
			disableFontFace: true,
			useSystemFonts: false,
			enableXfa: true,
			strictPagesToProcess: false,
			pdfFilePassword: undefined,
		},
		maxDiffPixels: 1,
	});
});
```

2. Построить отчет и сравнить расхождения
