import chalk from "chalk";
import os from "os";
import path from "path";
import { Analyzer } from "./proto/Analyzer";
import { FieldMapper } from "./proto/FieldMapper";
import { NameTranslation } from "./utils/nametranslation";
import { CmdIdGroup, getCmdIdGroup } from "./utils/cmdid";
import { Writer } from "./proto/Writer";
import Logger from "./utils/logger";
import { UniqueFieldCheck } from "./proto/analyzers/UniqueFieldCheck";
import { CmdIdMapper } from "./proto/CmdIdMapper";
import { MihoyoComparerV2 } from "./proto/MihoyoComparerV2";
import * as fs from 'fs';
import { DefineAnalyzer } from "./proto/analyzers/DefineAnalyzer";

const color2 = chalk.hex("#ffa7a6");
const color1 = chalk.hex("#f06c9c");

const mainCpu = os.cpus()[0];
const cpuModel = mainCpu?.model.split(" ") || [];
const cpuInfo = `${cpuModel[0]} ${os.cpus().length} cores ` + `@ ${(mainCpu?.speed || 0) / 1000}GHz `;

const version = color1("| proto-comparer ") + color2("v1.0");
const authors = color1("| With ♡ by ") + color2("timing");

const cpu = color1("| CPU: " + cpuInfo);
const ram = color1("| RAM: " + Math.floor(os.totalmem() / 1000000000) + "GB");

console.log(color2(`
                                       
   ▐▀▄       ▄▀▌   ▄▄▄▄▄▄▄             
   ▌▒▒▀▄▄▄▄▄▀▒▒▐▄▀▀▒██▒██▒▀▀▄          
  ▐▒▒▒▒▀▒▀▒▀▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▀▄        
  ▌▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▄▒▒▒▒▒▒▒▒▒▒▒▒▀▄           ${version}
▀█▒▒▒█▌▒▒█▒▒▐█▒▒▒▀▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▌          ${authors}
▀▌▒▒▒▒▒▒▀▒▀▒▒▒▒▒▒▀▀▒▒▒▒▒▒▒▒▒▒▒▒▒▒▐   ▄▄     ${color1("| Using: TypeScript")}
▐▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▌▄█▒█     ${color1("| License: MIT")}
▐▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒█▒█▀      ${cpu}
▐▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒█▀        ${ram}
▐▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▌         
 ▌▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▐     
 ▐▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▌     
  ▌▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▐      
  ▐▄▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▄▌      
    ▀▄▄▀▀▀▀▀▄▄▀▀▀▀▀▀▀▄▄▀▀▀▀▀▄▄▀        
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
`));

export const globalNameTranslation = new NameTranslation(path.join(__dirname, '..', 'resources', 'nametranslation.txt'));

(async () => {
  const deobfuscatedFieldMapper = new FieldMapper();
  await deobfuscatedFieldMapper.loadServerBinData(path.join(__dirname, '..', 'resources', 'deobfuscated'));
  const obfuscatedFieldMapper = new FieldMapper();
  await obfuscatedFieldMapper.loadNormal(path.join(__dirname, '..', 'resources', 'obfuscated'));
  const writer = new Writer(path.join(__dirname, '..', 'resources', 'obfuscated'));
  const logger = new Logger("Main");
  logger.debug("Running protocol ids mapper");
  const deobfuscatedCmdIds2 = new CmdIdMapper(path.join(__dirname, '..', 'resources', 'cmdids', 'deobfuscated.json'))
  const deobfuscatedCmdIds = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'resources', 'cmdids', 'packet_order.json'), 'utf-8'));
  const obfuscatedCmdIds = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'resources', 'cmdids', 'obfuscated.json'), 'utf-8'));
  
  const deobfuscatedNames =  Object.values(deobfuscatedCmdIds) as string[];
  const obfuscatedNames =  Object.values(obfuscatedCmdIds) as string[]; 

  const advanceComparer = new MihoyoComparerV2(deobfuscatedFieldMapper, obfuscatedFieldMapper, obfuscatedNames, deobfuscatedNames);

  //Manually pick the index of them
  //Player Group
  advanceComparer.compare(deobfuscatedNames.indexOf("GetPlayerTokenReq"), obfuscatedNames.indexOf("IILBBGICFMF"), deobfuscatedCmdIds2.cmdIds.get(CmdIdGroup.PLAYER)?.length);
  //Scene Group
  advanceComparer.compare(deobfuscatedNames.indexOf("PlayerEnterSceneNotify"), obfuscatedNames.indexOf("NJMPJEJNCGN"), deobfuscatedCmdIds2.cmdIds.get(CmdIdGroup.SCENE)?.length)
  //Scene 2 Group
  advanceComparer.compare(deobfuscatedNames.indexOf("SceneEntitiesMoveCombineNotify"), obfuscatedNames.indexOf("HNDFBPEGFML"), deobfuscatedCmdIds2.cmdIds.get(CmdIdGroup.SCENE)?.length)
  //ability group
  advanceComparer.compare(0, 0, deobfuscatedCmdIds2.cmdIds.get(CmdIdGroup.ABILITY)?.length)
  //Achivement group
  advanceComparer.compare(deobfuscatedNames.indexOf("AchievementAllDataNotify"), obfuscatedNames.indexOf("OCJLFBPMCDC"), deobfuscatedCmdIds2.cmdIds.get(CmdIdGroup.ACHIVEMENT)?.length)
  //Avatar group
  advanceComparer.compare(deobfuscatedNames.indexOf("AvatarAddNotify"), obfuscatedNames.indexOf('FNAKBGCGLFJ'), deobfuscatedCmdIds2.cmdIds.get(CmdIdGroup.AVATAR)?.length)
  //Item group
  advanceComparer.compare(deobfuscatedNames.indexOf("PlayerStoreNotify"), obfuscatedNames.indexOf('HILAGDNCPDA'), deobfuscatedCmdIds2.cmdIds.get(CmdIdGroup.AVATAR)?.length)
  //Misc group
  advanceComparer.compare(deobfuscatedNames.indexOf("KeepAliveNotify"), obfuscatedNames.indexOf("JPGDDMNBIKF"), deobfuscatedCmdIds2.cmdIds.get(CmdIdGroup.MISC)?.length)
  //Chat group
  advanceComparer.compare(deobfuscatedNames.indexOf("PrivateChatReq"), obfuscatedNames.indexOf("EMPPBBPFHCL"), deobfuscatedCmdIds2.cmdIds.get(CmdIdGroup.CHAT)?.length)
  //Fight group
  advanceComparer.compare(deobfuscatedNames.indexOf("EvtBeingHitNotify"), obfuscatedNames.indexOf("IMPMBPHGLEJ"), deobfuscatedCmdIds2.cmdIds.get(CmdIdGroup.FIGHT)?.length)
  //Property
  advanceComparer.compare(deobfuscatedNames.indexOf("EntityPropNotify"), obfuscatedNames.indexOf("EJIJIOCOFCE"), deobfuscatedCmdIds2.cmdIds.get(CmdIdGroup.PROPERTY)?.length)
  //Quest
  advanceComparer.compare(deobfuscatedNames.indexOf("QuestListNotify"), obfuscatedNames.indexOf("NPIECPAFMLF"), deobfuscatedCmdIds2.cmdIds.get(CmdIdGroup.QUEST)?.length)
  //Skill
  advanceComparer.compare(deobfuscatedNames.indexOf("UnlockAvatarTalentReq"), obfuscatedNames.indexOf("FBIPPMMPHCA"), deobfuscatedCmdIds2.cmdIds.get(CmdIdGroup.SKILL)?.length)
  //Social
  advanceComparer.compare(deobfuscatedNames.indexOf("GetPlayerFriendListReq"), obfuscatedNames.indexOf("EOBJCHOFOHJ"), deobfuscatedCmdIds2.cmdIds.get(CmdIdGroup.SOCIAL)?.length)
  //Activity
  advanceComparer.compare(deobfuscatedNames.indexOf("GetActivityScheduleReq"), obfuscatedNames.indexOf("EAHAMOIAELI"), 15)

  const cmdids: {
    [key: string]: number
  } = {};

  //IGNORE
  for(const [cmdid, proto] of Object.entries(obfuscatedCmdIds)){
    if(globalNameTranslation.getTranslation(proto) != proto){
      cmdids[globalNameTranslation.getTranslation(proto)] = parseInt(cmdid);
    }
  }

  fs.writeFileSync("cmdid.json", JSON.stringify(cmdids));
  function analyze(analyzer: Analyzer, removeDuplicatedName: boolean = false, loopThroughChild: boolean = false, debug: boolean = false) {
    for (const proto of obfuscatedNames) {
      analyzer.analyze(proto, removeDuplicatedName, loopThroughChild)
    }
  }

  function defineAnalyzerYay(analyzer: Analyzer){
    for(const proto of analyzer.deobfuscatedFieldMap.defineProtos) analyzer.analyze(proto);
  }

  //You can ignore this i guess? lmao no idea
  obfuscatedNames.push("LMMHLAOONBD")
  obfuscatedNames.push("APPEKGLKKJO")
  globalNameTranslation.addTranslation("LMMHLAOONBD", "QueryCurrRegionHttpRsp")
  globalNameTranslation.addTranslation("APPEKGLKKJO", "QueryRegionListHttpRsp")

  const uniqueFieldCheck = new UniqueFieldCheck(deobfuscatedFieldMapper, obfuscatedFieldMapper);
  const defineAnalyzer = new DefineAnalyzer(deobfuscatedFieldMapper, obfuscatedFieldMapper);
  logger.log("Running first analyzer");
  analyze(uniqueFieldCheck);
  defineAnalyzerYay(defineAnalyzer);
  let nametranslationCount = 0;
  while (nametranslationCount !== globalNameTranslation.map.size) {
    logger.log(`Got ${globalNameTranslation.map.size - nametranslationCount} new entries`)
    nametranslationCount = globalNameTranslation.map.size;
    logger.log("Running analyzer with new proto");
    analyze(uniqueFieldCheck, true, true);
    defineAnalyzerYay(defineAnalyzer);
  }
  globalNameTranslation.writeToFile(path.join(__dirname, '..', 'generated', "nametranslation.txt"));
  writer.applyAndWrite();
})();