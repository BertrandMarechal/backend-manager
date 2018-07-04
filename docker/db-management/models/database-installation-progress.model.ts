export interface IDatabaseInstallationProgress {
    [name: string]: any;

    repoName: string;
    version: string;
    user: string;
    installing: boolean;
    files: {
        fileName: string;
        done: boolean;
    }[];
}
export class DatabaseInstallationProgress {
    [name: string]: any;

    repoName: string;
    version: string;
    user: string;
    installing: boolean;
    files: {
        fileName: string;
        done: boolean;
    }[];

    constructor(params?: IDatabaseInstallationProgress) {
        this.repoName = '';
        this.version = '';
        this.user = '';
        this.installing = false;
        this.files = [];

        if (params) {
            for (const key in params) {
                if (params.hasOwnProperty(key)) {
                    this[key] = params[key];
                }
            }
        }
    }
}