//Another way to combat mihoyo dumbassery
//Now that cmdids group are fucked we can now only rely on classes order

import { globalNameTranslation } from "..";
import Logger from "../utils/logger";
import { CmdIdMapper } from "./CmdIdMapper";
import { FieldMapper } from "./FieldMapper";

export type Data = {
    name: string,
    skip: number,
}

const fuckedName = ["MAEDOGNMIEI", "GFAPBGDPMKM", "CDAKFOMPKEO", "HCKOKEPAAOF"];

const logger = new Logger("MihoyoComparerV2");

export class MihoyoComparerV2 {
    constructor(public deobfuscatedFieldMap: FieldMapper, public obfuscatedFieldMap: FieldMapper, public obfuscatedNames: string[], public deobfuscatedNames: string[]) {
    }

    public compare(deobfuscatedIndex: number = 0, obfuscatedIndex: number = 0, max: number = 1) {
        const maxEntriesCount = this.obfuscatedNames.length - this.deobfuscatedNames.length;
        logger.log(`Running with max entries count ${maxEntriesCount}`);
        let offset = obfuscatedIndex;
        let length = 0;
        for (let i = deobfuscatedIndex; i < this.deobfuscatedNames.length - 1; i++) {
            const deobfuscatedName = this.deobfuscatedNames[i];
            const deobfuscatedTypeMap = this.deobfuscatedFieldMap.mapperSortedByType.get(deobfuscatedName);
            const maxTries = offset + maxEntriesCount;
            while (offset < maxTries) {
                let obfuscatedName = this.obfuscatedNames[offset];
                if (fuckedName.includes(obfuscatedName)) {
                    logger.log(`STOPPED! We encounter a fucked name at ${obfuscatedName} comparing with ${deobfuscatedName}`);
                    return;
                }
                const obfuscatedTypeMap = this.obfuscatedFieldMap.mapperSortedByType.get(obfuscatedName);
                let skip = false;
                for (const type of obfuscatedTypeMap!.keys()) {
                    if (!deobfuscatedTypeMap!.has(type) || obfuscatedTypeMap!.get(type)!.length - deobfuscatedTypeMap!.get(type)!.length > 3) {
                        skip = true;
                        break;
                    }
                }
                if(skip){
                    offset++;
                }else{
                    length++;
                    logger.debug(`Found name~! ${obfuscatedName} | Index: ${offset} -> ${deobfuscatedName} | ${i}`)
                    globalNameTranslation.addTranslation(obfuscatedName, deobfuscatedName);
                    offset++;
                    break;
                }
            }
            if(length === max){
                return;
            }
        }
    }
}