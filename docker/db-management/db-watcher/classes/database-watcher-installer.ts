import { PostgresUtils } from "../../utils/postgres.utils";
import { DatabaseManagement } from "../../common/classes/database-management";

export enum DatabaseWatcherInstallerState {
    init = 'init',
    check = 'check',
    missingCurrentVersion = 'missingCurrentVersion',
    idle = 'idle',
    running = 'running',
    installationError = 'installationError',
    installationSuccess = 'installationSuccess',
}

export class DatabaseWatcherInstaller {
    state: DatabaseWatcherInstallerState;
    private previousVersionId?: string;
    private dbName: string;
    private versionName: string;
    private repoName: string;
    private databaseManagement: DatabaseManagement;

    constructor() {
        this.databaseManagement = new DatabaseManagement();
        this.repoName = process.argv[2];
        this.dbName = process.argv[3];
        this.versionName = '';
        this.databaseManagement.setConnectionString('postgres://root:route@localhost:5432/postgres');
        this.state = DatabaseWatcherInstallerState.init;
    }
    isAvailable() {
        return this.state === DatabaseWatcherInstallerState.idle ||
            this.state === DatabaseWatcherInstallerState.installationError ||
            this.state === DatabaseWatcherInstallerState.installationSuccess;
    }

    async runChecks() {
        this.state = DatabaseWatcherInstallerState.check;
        await this.checkCurrentVersion();
        await this.checkPreviousVersion();
        console.log(this.state, this.versionName, this.previousVersionId);
    }

    private async checkCurrentVersion() {
        // we check if the current version exists for our repo in the database
        const data = await this.databaseManagement.run(`
        SELECT max(dbv_version_id)
        FROM mgtt_database_version_dbv
        INNER JOIN mgtt_repository_rep
            ON pk_rep_id = fk_rep_dbv_repo_id
            AND rep_folder_name = '${this.repoName}'`);
        if (data.length === 0) {
            this.state = DatabaseWatcherInstallerState.missingCurrentVersion;
        } else {
            this.versionName = data[0].max;
        }
    }
    
    private async checkPreviousVersion() {
        // we check if we have one previous version
        if (this.state !== DatabaseWatcherInstallerState.missingCurrentVersion) {
            const data = await this.databaseManagement.run(`
            SELECT max(dbv_version_id)
            FROM mgtt_database_version_dbv
            INNER JOIN mgtt_repository_rep
                ON pk_rep_id = fk_rep_dbv_repo_id
                AND rep_folder_name = '${this.repoName}'
            where dbv_version_id != '${this.versionName}'`);
            if (data.length !== 0) {
                this.previousVersionId = data[0].max;
            }
        }
    }

    async install() {
        this.databaseManagement.prepareInstallationAndInstall({
            repoName: this.repoName,
            environment: 'local'
        },(progress: any) => {
            console.log('One more step...');
        })
        .then(() => {
            console.log('Done');
        })
        .catch((error) => {
            console.log(error);
        });
    }

    private async installPreviousVersion() {
        if(this.previousVersionId) {
            
        }
    }

    private async installCurrentVersion() {
        
    }
}