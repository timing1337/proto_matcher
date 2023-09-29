import * as fs from 'fs';
import path from 'path';
import Logger from './logger';

const logger = new Logger('NameTranslation');

export class NameTranslation{
    public map: Map<string, string> = new Map();
    public reverseMap: Map<string, string> = new Map();

    constructor(private filepath?: string){
        if(filepath){
            if(!fs.existsSync(filepath)){
                logger.error(`Unable to load ${filepath} nametranslation map`);
                return;
            }
            const content = fs.readFileSync(filepath, 'utf-8');
            content.split("\r\n").filter(line => !line.startsWith("#")).forEach(line => {
                const data = line.split("⇨");
                this.map.set(data[0], data[1]);
                this.reverseMap.set(data[1], data[0])
            });
            logger.log(`Loaded ${this.map.size} nametranslation pairs from ${path.basename(filepath)}`)
        }
    }

    public getTranslation(key: string): string{
        return this.map.has(key) ? this.map.get(key)! : key;
    }
    public getReversedTranslation(key: string): string{
        return this.reverseMap.has(key) ? this.reverseMap.get(key)! : key;
    }

    public addTranslation(key: string, value: string){
        this.map.set(key, value);
        this.reverseMap.set(value, key)
    }

    public writeToFile(filepath?: string){
        if(!filepath) filepath = this.filepath;
        let context = "";
        Array.from(this.map.entries()).forEach(([key, value], index) => {
            context += `${key}⇨${value}`
            if(index !== this.map.size - 1){
                context += "\n";
            }
        });
        fs.writeFileSync(filepath!, context);
    }
}