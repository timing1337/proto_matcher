import { globalNameTranslation } from "../..";
import Logger from "../../utils/logger";
import { Analyzer } from "../Analyzer";
import { FieldMapper } from "../FieldMapper";

const logger = new Logger("UniqueFieldCheck");

export class DefineAnalyzer extends Analyzer {
    constructor(public deobfuscatedFieldMap: FieldMapper, public obfuscatedFieldMap: FieldMapper) {
        super(deobfuscatedFieldMap, obfuscatedFieldMap);
    }


    public analyze(protoName: string, debug: boolean = false) {
        const nameTranslation: Map<string, string> = new Map<string, string>();
        let cancelEverything = false;
        let deobfuscatedName = protoName;
        let obfuscatedName!: string;
        if (globalNameTranslation.getTranslation(protoName) !== protoName) {
            deobfuscatedName = globalNameTranslation.getTranslation(protoName);
            obfuscatedName = protoName;
        } else if (globalNameTranslation.getReversedTranslation(protoName) !== protoName) {
            obfuscatedName = globalNameTranslation.getReversedTranslation(protoName);
        }
        if (debug) logger.log(`Analyzing ${obfuscatedName} -> ${deobfuscatedName}`)

        if (this.deobfuscatedFieldMap.defineProtos.includes(deobfuscatedName)) {
            const obfuscatedFieldMap = this.obfuscatedFieldMap.mapper.get(obfuscatedName);
            let obfuscatedFieldMapSortedType = this.obfuscatedFieldMap.mapperSortedByType.get(obfuscatedName)!;
            if (!obfuscatedFieldMap || !obfuscatedFieldMapSortedType) return;
            if (obfuscatedFieldMap.length < 1) return;
            const deobfuscatedFieldMap = this.deobfuscatedFieldMap.mapper.get(deobfuscatedName)!;
            if (!deobfuscatedFieldMap) return;

            for(const deobfuscatedField of deobfuscatedFieldMap){
                const obfuscatedField = obfuscatedFieldMap.find(field => field.fieldId == deobfuscatedField.fieldId);
                //do both strict check and other check
                if(obfuscatedField?.getTypeString(true, true) == deobfuscatedField.getTypeString(true, true)){
                    nameTranslation.set(obfuscatedField.name, deobfuscatedField.name)
                    if(debug) logger.log(`${obfuscatedField.name} -> ${deobfuscatedField.name}`);
                }else{
                    cancelEverything = true;
                    return;
                }
            }
            if(!cancelEverything) nameTranslation.forEach((value, key) => globalNameTranslation.addTranslation(key, value));
        }
    };
}