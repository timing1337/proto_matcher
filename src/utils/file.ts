import * as fs from 'fs';
import path from 'path';

export function getFilesRecursively(directory: string) {
    let files: string[] = [];
    const filesInDirectory = fs.readdirSync(directory);
    for (const file of filesInDirectory) {
        const absolute = path.join(directory, file);
        if (fs.statSync(absolute).isDirectory()) for (const subfile of getFilesRecursively(absolute)) files.push(subfile); else files.push(absolute);
    }
    return files;
}