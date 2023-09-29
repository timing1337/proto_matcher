import { CmdIdGroup, getCmdIdGroup } from "../utils/cmdid";
import * as fs from 'fs';

export class CmdIdMapper{
    public cmdIds: Map<CmdIdGroup, string[]> = new Map<CmdIdGroup, string[]>();

    constructor(file_path: string){
        const json = JSON.parse(fs.readFileSync(file_path, 'utf-8'));
        for(const [group, protoName] of Object.entries(json)){
            const cmdIdGroup = getCmdIdGroup(parseInt(group.trim()));
            if(cmdIdGroup == CmdIdGroup.UNKNOWN) continue;
            if(!this.cmdIds.has(cmdIdGroup)) this.cmdIds.set(cmdIdGroup, []);
            this.cmdIds.get(cmdIdGroup)!.push(protoName as string);
        }
    }
}