import { DatabaseManagement } from "./database-management";
import { rejects } from "assert";
import { FileUtils } from "../utils/file.utils";

export class RepositoryReader {
    private databaseManagement: DatabaseManagement;

    constructor(databaseManagement: DatabaseManagement) {
        this.databaseManagement = databaseManagement;
    }

    getRepositoryList(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.databaseManagement
                .execute('mgtf_get_repositories')
                .then(data => {
                    if (!data || data.length === 0) {
                        FileUtils.getFolderList({
                            startPath: process.argv[2] ? '../../../':'../repos/'
                        }).then((fileList: string[]) => {
                            fileList = fileList.map(x => x.replace('../../../', '../repos/'));
                            
                            this.databaseManagement
                                .execute('mgtf_update_repo_folders', [fileList])
                                .then((data: any) => {
                                    resolve(data);
                                }).catch((error) => {
                                    reject(data);
                                });
                        }).catch(reject);
                    }
                })
                .catch(reject);
        });
    }
    getDatabaseVersionFiles(): Promise<any> {
        return Promise.resolve();
    }

    geMiddleTierServerlessFiles(): Promise<any> {
        return Promise.resolve();
    }

    geMiddleTierVariableFiles(): Promise<any> {
        return Promise.resolve();
    }
}