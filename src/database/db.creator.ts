import { logger } from "../utils/logs";
import fs from 'fs';
import mPath from 'path';

export function createDatabaseIfNotExists(typeormDataSource: any) {
    if (typeormDataSource._typeormExtension) return;
    try {
        typeormDataSource._typeormExtension = require('typeorm-extension');
    } catch (err) {
        let typeormExtPath: string | string[] | undefined = [
            mPath.join(process.cwd(), 'node_modules/typeorm-extension'),
            mPath.join(process.cwd(), '../node_modules/typeorm-extension')
        ];
        typeormExtPath = typeormExtPath.find(path => fs.existsSync(path));
        if (!typeormExtPath) throw "createDatabaseIfNotExists: typeorm-extension module not found";
        typeormDataSource._typeormExtension = require(typeormExtPath);
    }
    const _initialize = typeormDataSource.initialize.bind(typeormDataSource);
    typeormDataSource.initialize = async () => {
        await typeormDataSource._typeormExtension.createDatabase({
            options: typeormDataSource.options, 
            ifNotExist: true
        });
        logger.log("Database was created");
        return _initialize();
    }
}