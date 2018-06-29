import { PostgresUtils } from "../utils/postgres.utils";
import { FileUtils } from "../utils/file.utils";

const originFolder = process.argv[2] ? '../../../' : '../repos/';

interface FolderStructureItem {
    folderName?: string,
    children?: FolderStructureItem[],
    fileName?: string,
    fileSource?: string,
}
export class DatabaseManagement {
    postgresUtils: PostgresUtils;
    filesData: {[name: string]: string};

    constructor() {
        this.filesData = {};
        this.postgresUtils = new PostgresUtils();
        this.postgresUtils.setConnectionString(process.argv[2] ? 'postgres://root:route@localhost:5432/postgres' : 'postgres://root:route@postgresdb:5432/postgres')
    }

    execute(functionName: string, data?: any[]): Promise<any> {
        return this.postgresUtils.executeFunction(functionName, data)
    }

    createDatabaseFolderStructure(repoName: string, dbAlias: string): Promise<any> {
        return new Promise((resolve, reject) => {
            FileUtils.readJsonFile(__dirname + '/../data/database-structure/folder-structure.json')
                .then((folderStructure: FolderStructureItem[]) => {
                    console.log(folderStructure);
                    
                    for (let i = 0; i < folderStructure.length; i++) {
                        const element = folderStructure[i];
                        this.processFolderStructureItem(element, dbAlias, originFolder + repoName + '/');
                    }
                    resolve();
                })
                .catch(reject);
        });
    }

    private processFolderStructureItem(folderStructureItem: FolderStructureItem, dbAlias: string, currentPath: string) {
        if (folderStructureItem.folderName) {
            console.log('Creating ' + currentPath + folderStructureItem.folderName);
            
            FileUtils.createFolderIfNotExistsSync(currentPath + folderStructureItem.folderName);
            if (folderStructureItem.children) {
                for (let i = 0; i < folderStructureItem.children.length; i++) {
                    const element = folderStructureItem.children[i];
                    this.processFolderStructureItem(element, dbAlias, currentPath + folderStructureItem.folderName + '/');
                }
            } else {
                FileUtils.writeFileSync(currentPath + 'placeholder_to_delete.txt', '');
            }
        } else if (folderStructureItem.fileName) {
            let source = '';
            if (folderStructureItem.fileSource) {
                source = this.filesData[folderStructureItem.fileSource];
                if (!source) {
                    source = FileUtils.readFileSync(__dirname + '/../data/database-structure/files/' + folderStructureItem.fileSource);
                    this.filesData[folderStructureItem.fileSource] = source;
                }
                source = source.replace(/\<db\>/gi, dbAlias);
            }
            console.log('Creating ' + currentPath + folderStructureItem.fileName);
            FileUtils.writeFileSync(currentPath + folderStructureItem.fileName, source);
        }
    }
}