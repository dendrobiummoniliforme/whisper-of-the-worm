/**
 * @author dendrobiummoniliforme.
 * @since 2022, 05, 13.
 * @description This file is used to generate a theme based off of a provided swatches.theme file.
 * @usage `npm run theme -- "./.ignore/<SHADER_NAME>.png"`
 * @example `npm run theme -- "./.ignore/default_icon_128.png" >> ./themes/default_icon.json`.
 * @see https://github.com/dendrobiummoniliforme/whisper-of-the-worm/blob/main/CONTRIBUTING.md.
 */
import { 
    randomizeTheme, 
    removeSwatchHex, 
    getPaletteFromImage, 
    getRGBSwatchesFromPalette, 
    getHexFromRGB 
} from "./Theme.js";
import { getRandomInt } from "./Math.js";
import { log } from "./Log.js";
import * as fs from "fs";
import { exit } from "process";

/**
 * Simple CLI.
 */
const defaultLog = `Usage: npm run theme <path_to_shader>`;
const argv = process.argv;
const path = argv[2];

// Guard clauses.
if (argv.length > 3 || argv.length <= 2) {
    log(`${defaultLog}: Expecting 1 argument.`);
    exit(1);
}
if (typeof path !== 'string') {
    log(`${defaultLog}: Expecting a String (path).`);
    exit(2);
}
if (fs.existsSync(path) !== true) {
    log(`${defaultLog}: File does not exist.`);
    exit(3);
}

/**
 * Pipeline.
 */
const palette = await getPaletteFromImage(path);
const swatches = getRGBSwatchesFromPalette(palette);
const hex = getHexFromRGB(swatches);
const maxIntegerValue = swatches.length - 1; // Index from 0.
const editorBackground = hex[getRandomInt(maxIntegerValue)];
const processedHex = removeSwatchHex(hex, editorBackground);
const generatedTheme = randomizeTheme(processedHex, maxIntegerValue, editorBackground);

// Log to stdout; this can be piped.
log(generatedTheme);
