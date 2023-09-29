import { globalNameTranslation } from "../..";
import Logger from "../../utils/logger";
import { Analyzer } from "../Analyzer";
import { Enum, FieldInfo, FieldMapper, isClass, MapField, Repeated } from "./../FieldMapper";

const logger = new Logger("UniqueFieldCheck");

export class UniqueFieldCheck extends Analyzer {
    constructor(public deobfuscatedFieldMap: FieldMapper, public obfuscatedFieldMap: FieldMapper) {
        super(deobfuscatedFieldMap, obfuscatedFieldMap);
    }

    public analyze(protoName: string, removeDuplicatedName: boolean = false, loopThroughChild: boolean = false, debug: boolean = false) {
        let deobfuscatedName = protoName;
        let obfuscatedName!: string;
        if(globalNameTranslation.getTranslation(protoName) !== protoName){
            deobfuscatedName = globalNameTranslation.getTranslation(protoName);
            obfuscatedName = protoName;
        }else if(globalNameTranslation.getReversedTranslation(protoName) !== protoName){
            obfuscatedName = globalNameTranslation.getReversedTranslation(protoName);
        }
        if(debug){
            logger.log(`Analyzing ${obfuscatedName} -> ${deobfuscatedName} | RemoveDuplicatedName: ${removeDuplicatedName} | LoopThroughChild ${loopThroughChild}`)
        }
        const obfuscatedFieldMap = this.obfuscatedFieldMap.mapper.get(obfuscatedName);
        let obfuscatedFieldMapSortedType = this.obfuscatedFieldMap.mapperSortedByType.get(obfuscatedName)!;
        if (!obfuscatedFieldMap || !obfuscatedFieldMapSortedType) return;
        if (obfuscatedFieldMap.length < 1) return;
        const deobfuscatedFieldMap = this.deobfuscatedFieldMap.mapper.get(deobfuscatedName)!;
        if (!deobfuscatedFieldMap) return;
        let deobfuscatedFields = Array.from(deobfuscatedFieldMap.values());
        let obfuscatedFields = Array.from(obfuscatedFieldMap.values());
        if(loopThroughChild){
            if(debug) logger.log("Running through child");
            deobfuscatedFields.forEach(field => {
                if(debug) logger.log(`Analyzing ${field.getTypeString()}`);
                if (field.type instanceof Repeated) {
                    if (isClass(field.type.type)) {
                        this.analyze(field.type.type, true, loopThroughChild)
                    }
                } else if (field.type instanceof MapField) {
                    if (isClass(field.type.keyType)) {
                        this.analyze(field.type.keyType, true, loopThroughChild)
                    }
                    if (isClass(field.type.valueType)) {
                        this.analyze(field.type.valueType, true, loopThroughChild)
                    }
                } else {
                    if (field.getTypeString(true) === "class") {
                        this.analyze(field.getTypeString(), true, loopThroughChild)
                    }
                }
                this.analyze(field.getTypeString(), true, loopThroughChild)
            });
        }
        if (removeDuplicatedName) {
            obfuscatedFieldMapSortedType = new Map<string, FieldInfo[]>();
            obfuscatedFields.forEach(field => {
                const deobfuscatedField = deobfuscatedFields.find(deobfuscatedField => (deobfuscatedField.name === field.name || deobfuscatedField.name === globalNameTranslation.getTranslation(field.name)));
                if (deobfuscatedField) {
                    //????
                    if(deobfuscatedField.getTypeString(false, true) !== field.getTypeString(false, true)){
                        this.analyzeField(field, deobfuscatedField)
                    }
                    obfuscatedFields = obfuscatedFields.filter(function (item) {
                        return item.name !== field.name
                    })
                    deobfuscatedFields = deobfuscatedFields.filter(function (item) {
                        return item.name !== deobfuscatedField.name
                    })
                }
                if(debug) logger.log(`Removing duplicated names. New deobf ${deobfuscatedFields.map(field => field.getTypeString()).join(", ")}`);
            });
            obfuscatedFields.forEach(field => {
                const fields = deobfuscatedFields.filter(deobfuscatedField => field.getTypeString(false, true) == deobfuscatedField.getTypeString(false, true));
                if (fields.length == 1) {
                    this.analyzeField(field, fields.shift()!)
                }
            });
            const debugs: string[] = [];
    
            obfuscatedFields.forEach(field => {
                if (!obfuscatedFieldMapSortedType.has(field.getTypeString(true))) obfuscatedFieldMapSortedType.set(field.getTypeString(true), [])
                if(!obfuscatedFieldMapSortedType.get(field.getTypeString(true))?.includes(field)){
                    obfuscatedFieldMapSortedType.get(field.getTypeString(true))?.push(field)
                    debugs.push(field.getTypeString());
                }
            })
            if(debug) logger.log(`New obfucated. New ${debugs.join(", ")}`);
        }
        //
        // FIRST CHECK
        // We check the uniqueness of the proto if every fields type is unique or not.
        //        
        Array.from(obfuscatedFieldMapSortedType.entries()).forEach(([type, fields]) => {
            if (fields.length !== 1) return;
            const deobfuscatedField = deobfuscatedFields.filter(field => field.getTypeString(true) === type)[0];
            const obfuscatedField = fields[0];
            if (!deobfuscatedField) return;
            const checkDuplication = globalNameTranslation.getTranslation(obfuscatedField.name);
            if(deobfuscatedField.name == "level_type"){
                logger.warn(`Obfuscated: ${obfuscatedField.name} | First: ${globalNameTranslation.getTranslation(obfuscatedField.name)} | Second: ${deobfuscatedField.name} | At ${protoName} and ${obfuscatedName}. Suggest running a debug check`)
            }
            if (checkDuplication !== obfuscatedField.name && checkDuplication !== deobfuscatedField.name && globalNameTranslation.getTranslation(obfuscatedField.name) !== deobfuscatedField.name) {
                logger.warn(`Found duplicated nametranslation strings! Obfuscated: ${obfuscatedField.name} | First: ${globalNameTranslation.getTranslation(obfuscatedField.name)} | Second: ${deobfuscatedField.name} | At ${protoName} and ${obfuscatedName}. Suggest running a debug check`)
                return;
            }
            if(obfuscatedField.name.toUpperCase() !== obfuscatedField.name){
                if(deobfuscatedField.name !== obfuscatedField.name){
                    logger.warn(`Found weird nametranslation strings! Obfuscated: ${obfuscatedField.name} | Deobfuscated: ${deobfuscatedField.name} | At ${protoName}. Suggest running a debug check`)
                }
                return;
            }
            this.analyzeField(obfuscatedField, deobfuscatedField);
            //logger.log(`${protoName} matched ${obfuscatedField.name}(${obfuscatedField.getTypeString()}) with ${deobfuscatedField.name}(${deobfuscatedField.getTypeString()})!`);
        });
    }
}