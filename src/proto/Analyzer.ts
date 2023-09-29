import { readFileSync, writeFileSync } from "fs";
import { globalNameTranslation } from "..";
import Logger from "../utils/logger";
import { Enum, FieldInfo, FieldMapper, isClass, MapField, Repeated } from "./FieldMapper";

const logger = new Logger("Analyzer");

export abstract class Analyzer {
    constructor(public deobfuscatedFieldMap: FieldMapper, public obfuscatedFieldMap: FieldMapper) {
    }

    public analyzeField(obfuscatedField: FieldInfo, deobfuscatedField: FieldInfo) {
        globalNameTranslation.addTranslation(obfuscatedField.name, deobfuscatedField.name)
        if (obfuscatedField.type instanceof Repeated && deobfuscatedField.type instanceof Repeated) {
            if (isClass(obfuscatedField.type.type)) {
                globalNameTranslation.addTranslation(obfuscatedField.type.type, deobfuscatedField.type.type);
                this.analyze(obfuscatedField.type.type, true)
            }
        } else if (obfuscatedField.type instanceof MapField && deobfuscatedField.type instanceof MapField) {
            if (isClass(obfuscatedField.type.keyType)) {
                globalNameTranslation.addTranslation(obfuscatedField.type.keyType, deobfuscatedField.type.keyType);
                this.analyze(obfuscatedField.type.keyType, true)
                this.analyze(obfuscatedField.type.keyType, true)
            }
            if (isClass(obfuscatedField.type.valueType)) {
                globalNameTranslation.addTranslation(obfuscatedField.type.valueType, deobfuscatedField.type.valueType);
                this.analyze(obfuscatedField.type.valueType, true)
            }
        } else if (obfuscatedField.type instanceof Enum) {
            if(!["ProtEntityType", "VisionType", "EnterType", "MonsterBornType", "MpSettingType", "FriendOnlineState", "CombatTypeArgument", "WidgetSlotTag", "MovingPlatformType"].includes(deobfuscatedField.getTypeString(false, true))){
                globalNameTranslation.addTranslation(obfuscatedField.getTypeString() + "_Enum", deobfuscatedField.getTypeString().split(/(?=[A-Z])/).map(name => name.toUpperCase()).join("_"));
            }else{
                globalNameTranslation.addTranslation(obfuscatedField.getTypeString() + "_Enum_", "");
            }
            globalNameTranslation.addTranslation(obfuscatedField.getTypeString(), deobfuscatedField.getTypeString());
        } else {
            if (obfuscatedField.getTypeString(true) === "class") {
                globalNameTranslation.addTranslation(obfuscatedField.getTypeString(), deobfuscatedField.getTypeString());
                this.analyze(obfuscatedField.getTypeString(), true)
            }
        }
    }

    public analyze(protoName: string, removeDuplicatedName: boolean = false, loopThroughChild: boolean = false){

    }
}