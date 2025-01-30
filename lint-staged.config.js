/* eslint-disable no-undef */
module.exports = {
	// this will check Typescript files
	"**/*.(ts|tsx)": () => "npx tsc --noEmit --skipLibCheck",
	"**/*.(ts|tsx|js)": (filenames) => [
		`npx eslint --fix ${filenames.join(" ")}`,
		`npx prettier --write ${filenames.join(" ")}`,
	],

	// this will Format MarkDown and JSON
	"**/*.(md|json)": (filenames) => `npx prettier --write ${filenames.join(" ")}`,
};
