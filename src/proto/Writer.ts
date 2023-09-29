import path from "path";
import * as fs from 'fs';
import { globalNameTranslation } from "..";
import { getFilesRecursively } from "../utils/file";
import Logger from "../utils/logger";

const logger = new Logger("Writer");

export class Writer {
    constructor(public obfuscated_path: string) { }

    public applyAndWrite() {
        //fs.unlinkSync(path.join(__dirname, "..", "..", "generated"));
        //fs.mkdirSync(path.join(__dirname, "..", "..", "generated"));
        for (const file of getFilesRecursively(this.obfuscated_path)) {
            const name = path.basename(file).split(".")[0];
            const translatedName = globalNameTranslation.getTranslation(name);
            let content = fs.readFileSync(file, 'utf-8');
            Array.from(globalNameTranslation.map.entries()).forEach(([key, value]) => {
                if (key === "DONT_KNOW") return;
                content = content.replaceAll(key, value);
            })
            fs.writeFileSync(path.join(__dirname, "..", "..", "generated", translatedName + ".proto"), content);
        }
        logger.log("Finished writing protos");
    }
}