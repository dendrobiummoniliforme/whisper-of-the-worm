import * as fs from "fs";
import { exit } from "process";
import { log } from "./src/Log.js";

/**
 * Reads in package.json.
 * @returns package.json encoded to JSON.
 */
const getPackageFile = () => {
    let file = {};
    file = JSON.parse(
        fs.readFileSync(
            "./package.json", 
            {
                encoding: "UTF8", 
                flag: "r"
            }
        )
    );
    return file;
}

/**
 * getter for our file's tag version value.
 * @param json file 
 * @returns 
 */
export const getTag = (file) => {
    return file.version;
}

/**
 * Updates the current specified value in our tag.
 * @param string tag x -> x_n.y -> y_n.z -> z_n Ex. 1.0.0
 * @param string type major|minor|patch
 * @returns tag Ex. 1.0.1
 */
export const updateTag = (tag, type) => {
    const tags = tag.split(".")
    switch(type) {
        case "major":
            tags[0] = `${Number(tags[0]) + 1}`;
            break;
        case "minor":
            tags[1] = `${Number(tags[1]) + 1}`;
            break;
        case "patch":
            tags[2] = `${Number(tags[2]) + 1}`;
            break;
    }
    return tags.join(".");
}

/**
 * 
 * @param json file 
 * @param {string} tag x -> x_n.y -> y_n.z -> z_n Ex. 1.0.0
 * @returns file
 */
export const setTag = (file, tag) => {
    // See https://stackoverflow.com/questions/41510186/cannot-create-property-on-string
    return {
        ...file, 
        version: tag
    };
}

/**
 * Writes file to drive.
 * @param json file 
 */
export const setPackageFile = (file) => {
    fs.writeFileSync("./package.json", JSON.stringify(file, null, 2));
}

/**
 * Simple CLI.
 */
const defaultLog = `Usage: node Tag.js <type: major|minor|patch>`;
const argv = process.argv;
const type = argv[2];
const file = getPackageFile();
const viable = ["major", "minor", "patch", "get"];

// Guard clauses.
if (argv.length > 3 || argv.length <= 2) {
    log(`${defaultLog}: Expecting 1 argument.`);
    exit(1);
}

if (typeof type !== 'string') {
    log(`${defaultLog}: Expecting a String type.`);
    exit(2);
}

if (!viable.includes(type)) {
    log(`${defaultLog}: Expecting one of major, minor, patch, or get.`);
    exit(3)
}

if (!fs.existsSync("./package.json")) {
    log("File does not exist");
    exit(4);
}

if (type === "get") {
    const tagToGet = getTag(file);
    log(tagToGet);
} else {
    const fileToUpdate = setTag(
        file, 
        updateTag(
            getTag(file), type
        )
    );
    setPackageFile(fileToUpdate);
    log(fileToUpdate);
}