import * as fs from 'fs';
import { getFilesRecursively } from '../utils/file';
import Logger from '../utils/logger';
import * as protobufjs from 'protobufjs';
import path from 'path';
import { globalNameTranslation } from '..';

const logger = new Logger("FieldMapper");

export function isClass(string: string): boolean {
    return string.charAt(0).toUpperCase() === string.charAt(0);
}

export class FieldInfo {
    constructor(public name: string, public fieldId: number, public type: string | Repeated | MapField | Enum) { }

    public getTypeString(setUnknownClass: boolean = false, nametranslation: boolean = false): string {
        if (this.type instanceof Repeated) {
            return "repeated " + ((isClass(this.type.type) && setUnknownClass) ? "class" : (nametranslation ? globalNameTranslation.getTranslation(this.type.type) : this.type.type));
        } else if (this.type instanceof MapField) {
            return `map<${((isClass(this.type.keyType) && setUnknownClass) ? "class" : (nametranslation ? globalNameTranslation.getTranslation(this.type.keyType) : this.type.keyType))}, ${((isClass(this.type.valueType) && setUnknownClass) ? "class" : (nametranslation ? globalNameTranslation.getTranslation(this.type.valueType) : this.type.valueType))}>`
        } else if (this.type instanceof Enum) {
            return (setUnknownClass) ? "enum" : (nametranslation ? globalNameTranslation.getTranslation(this.type.type) : this.type.type);
        } else {
            return (isClass(this.type) && setUnknownClass) ? "class" : this.type;
        }
    }
}

export class Repeated {
    constructor(public type: string) { }
}

export class Enum {
    constructor(public type: string) { }
}

export class MapField {
    constructor(public keyType: string, public valueType: string) { }
}

export class FieldMapper {
    public mapper: Map<string, FieldInfo[]> = new Map<string, FieldInfo[]>();
    public mapperSortedByType: Map<string, Map<string, FieldInfo[]>> = new Map<string, Map<string, FieldInfo[]>>();
    public fieldUsageList: Map<string, number> = new Map<string, number>();

    //Hardcoded
    public defineProtos: string[] = ["SocialDetail", "FriendBrief"];

    public defineRoot?: protobufjs.Root;

    public async loadNormal(proto_path: string){
        this.mapper.clear();
        this.mapperSortedByType.clear();
        this.fieldUsageList.clear();
        for (const file of getFilesRecursively(proto_path)) {
            try {
                const proto = new protobufjs.Root().loadSync(file, {
                    keepCase: true
                });
                for (const nested of proto.nestedArray) {
                    if (nested instanceof protobufjs.Type) {
                        this.loadRecursiveProto(nested);
                    }
                }
            } catch (ex) {
                /* @ts-ignore */
                console.log(ex.message);
                logger.error(`There was an issue with proto ${path.basename(file)}`)
            }
        }
    }
    
    public async loadServerBinData(proto_path: string){
        this.mapper.clear();
        this.mapperSortedByType.clear();
        this.fieldUsageList.clear();
        try {
            this.defineRoot = new protobufjs.Root();
            await this.defineRoot.load(getFilesRecursively(proto_path), {
                keepCase: true
            });
            for (const nested of this.defineRoot.nestedArray) {
                if (nested instanceof protobufjs.Type) {
                    this.loadRecursiveProto(nested);
                }
            }
        } catch (ex) {
            /* @ts-ignore */
            console.log(ex.message);
        }
    }

    public loadRecursiveProto(proto: protobufjs.Type, parent?: protobufjs.Root) {
        if (proto instanceof protobufjs.Enum) {
            return;
        }
        const protoName = proto.name;
        if (this.mapper.has(protoName)) return;
        if(proto.filename?.includes("define.proto")) this.defineProtos.push(protoName)
        this.mapper.set(protoName, []);
        this.mapperSortedByType.set(protoName, new Map<string, FieldInfo[]>());

        for (const [key, field] of Object.entries(proto.fields)) {
            let type: string | Repeated | MapField = field.type;
            if (field.repeated) {
                type = new Repeated(field.type);
            } else if (field instanceof protobufjs.MapField) {
                type = new MapField(field.keyType, field.type);
            } else if (proto.root.lookup(field.type) instanceof protobufjs.Enum) {
                type = new Enum(field.type);
            } else if (field.resolvedType instanceof protobufjs.Enum) {
                type = new Enum(field.type);
            }
            const fieldInfo = new FieldInfo(field.name, field.id, type);
            this.mapper.get(protoName)!.push(fieldInfo);
            if (!this.mapperSortedByType.get(protoName)?.has(fieldInfo.getTypeString(true))) this.mapperSortedByType.get(protoName)?.set(fieldInfo.getTypeString(true), [])
            this.mapperSortedByType.get(protoName)?.get(fieldInfo.getTypeString(true))?.push(fieldInfo);
            !this.fieldUsageList.has(field.name) ? this.fieldUsageList.set(field.name, 1) : this.fieldUsageList.set(field.name, this.fieldUsageList.get(field.name)! + 1);
        }
    }
}