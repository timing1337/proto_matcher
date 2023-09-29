import { writeFileSync } from "fs";
import path from "path";
import { globalNameTranslation } from "..";
import { CmdIdGroup } from "../utils/cmdid";
import Logger from "../utils/logger";
import { CmdIdMapper } from "./CmdIdMapper";
import { FieldMapper } from "./FieldMapper";
const logger = new Logger("AdvanceComparer");

export class AdvanceComparer {
    constructor(public deobfuscatedFieldMap: FieldMapper, public obfuscatedFieldMap: FieldMapper, public obfuscatedMap: CmdIdMapper, public deobfuscatedMap: CmdIdMapper){

    }
    /*
    NOTE:
    * Quest:
        - GetQuestTalkHistoryReq & GetQuestTalkHistoryRsp deprecated
    */

    public compare(){
        for(const [cmdIdGroup, deobfuscatedProtos] of this.deobfuscatedMap.cmdIds.entries()){
            //now check if count changed
            if(cmdIdGroup == CmdIdGroup.GCG || cmdIdGroup == CmdIdGroup.ACTIVITY_2) continue;
            try{
                const obfuscatedProtos = this.obfuscatedMap.cmdIds.get(cmdIdGroup)!;
                //nothing changed in the sequence
                if(deobfuscatedProtos.length == obfuscatedProtos.length){
                    for(var i = 0; i < deobfuscatedProtos.length; i++){
                        const obfuscatedProto = obfuscatedProtos[i];
                        const deobfuscatedProto = deobfuscatedProtos[i];
                        globalNameTranslation.addTranslation(obfuscatedProto, deobfuscatedProto);
                    }
                }else{
                    for(var i = 0; i < deobfuscatedProtos.length; i++){
                        let offset = 0;
                        const deobfuscatedProto = deobfuscatedProtos[i];
                        const deobfuscatedTypeMap = this.deobfuscatedFieldMap.mapperSortedByType.get(deobfuscatedProto);
                        logger.debug("Searching for the " + deobfuscatedProto);
                        while(offset !== -1){
                            const obfuscatedProto = obfuscatedProtos[i + offset];
                            logger.debug("Comparing with " + obfuscatedProto);
                            const obfuscatedTypeMap = this.obfuscatedFieldMap.mapperSortedByType.get(obfuscatedProto);
                            let skip = false;
                            for(const type of obfuscatedTypeMap!.keys()){
                                if(!deobfuscatedTypeMap!.has(type) || obfuscatedTypeMap!.get(type)!.length !== deobfuscatedTypeMap!.get(type)!.length){
                                    skip = true;
                                    break;
                                }
                            }
                            if(skip){
                                offset++;
                            }else{
                                logger.debug(`Found name~! ${obfuscatedProto} -> ${deobfuscatedProto}`)
                                globalNameTranslation.addTranslation(obfuscatedProto, deobfuscatedProto);
                                offset = -1;
                                break;
                            }
                        }
                    }
                }
            }catch(ex){
                logger.warn("Skipped group " + cmdIdGroup);
                console.log(ex);
                continue;
            }
        }
        writeFileSync(path.join(__dirname, "..", "logs.txt"), logger.logs.join("\n"));
    }
}