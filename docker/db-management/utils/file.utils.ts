import * as fs from 'fs';
import * as path from 'path';

export class FileUtils {
    static getFileList(params: {
        startPath: string,
        foldersToIgnore?: string[],
        filter: RegExp;
    }): Promise<any> {
        const foldersToIgnore = params.foldersToIgnore || ['node_modules'];
        if (foldersToIgnore) {
            if (foldersToIgnore.indexOf('node_modules') === -1) {
                foldersToIgnore.push('node_modules');
            }
        }
        
        if (!fs.existsSync(params.startPath)) {
            console.log(params.startPath + ' does not exist');
            return Promise.resolve([]);
        }
        else {
            let fileNames = fs.readdirSync(params.startPath);
            let directories = fileNames.filter((x: string) => {
                let fileName = path.join(params.startPath, x);
                let stat = fs.lstatSync(fileName);
                if (stat.isDirectory()) {
                    return foldersToIgnore.filter(y => fileName.indexOf(y) > -1).length === 0
                }
                return false;
            });
            let files = fileNames.filter((x: string) => {
                let fileName = path.join(params.startPath, x);
                let stat = fs.lstatSync(fileName);
                return !stat.isDirectory() && params.filter.test(fileName);
            });
            if (directories.length > 0) {
                return Promise.all(directories.map((x: string) => {
                    return FileUtils.getFileList({startPath: params.startPath + '/' + x, filter: params.filter, foldersToIgnore: foldersToIgnore})
                })).then((fileLists: any) => {
                    let fileList = fileLists.reduce((current: string[], item: string[]) => {
                        current = current.concat(item);
                        return current;
                    }, []);
                    fileList = fileList.concat(files.map((x: string) => params.startPath + '/' + x));
                    return new Promise((resolve) => {
                        resolve(fileList);
                    });
                });
            }
            else {
                return new Promise((resolve) => {
                    resolve(files.map((x: string) => params.startPath + '/' + x));
                });
            }
        }
    }
    
    static getFolderList(params: {
        startPath: string,
        foldersToIgnore?: string[]
    }): Promise<string[]> {
        const foldersToIgnore = params.foldersToIgnore || ['node_modules'];
        if (foldersToIgnore) {
            if (foldersToIgnore.indexOf('node_modules') === -1) {
                foldersToIgnore.push('node_modules');
            }
        }
        
        if (!fs.existsSync(params.startPath)) {
            console.log(params.startPath + ' does not exist');
            return Promise.resolve([]);
        }
        else {
            let fileNames = fs.readdirSync(params.startPath);
            let directories = fileNames.filter((x: string) => {
                let fileName = path.join(params.startPath, x);
                let stat = fs.lstatSync(fileName);
                if (stat.isDirectory()) {
                    return foldersToIgnore.filter(y => fileName.indexOf(y) > -1).length === 0
                }
                return false;
            });            
            return Promise.resolve(directories.map(x => params.startPath + '/' + x));
        }
    }

    static readFile(fileName: string): Promise<string> {
        return new Promise((resolve, reject) => {
            fs.readFile(fileName, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data.toString('ascii'));
                }
            });
        });
    }

    static readJsonFile(fileName: string) {
        return new Promise((resolve, reject) => {
            fs.readFile(fileName, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(JSON.parse(data.toString('ascii')));
                }
            });
        });
    }
}