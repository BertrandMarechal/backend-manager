import {FileUtils} from "../utils/file.utils";

export class AwsS3 {
    putObject(params: any): Promise<any> {
        return new Promise((resolve, reject) => {
            if (params.Body.type === 'Buffer') {
                console.log('Buffer');
                params.Body = Buffer.from(params.Body.data);
            }
            FileUtils.writeFileInItsFolder(__dirname + '../../temp/s3/' + params.Bucket + '/' + params.Key, params.Body)
                .then((error: any) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                })
                .catch((error) => {
                    reject(error);
                });
        });
    };
    deleteObject(params: any): Promise<any> {
        return new Promise((resolve, reject) => {
            FileUtils.deleteFileSync(__dirname + '../../temp/s3/' + params.Bucket + '/' + params.Key);
            resolve();
        });
    };
}