import logger from "../utils/logs";

export function createDatabaseIfNotExists(typeormDataSource: any) {
    if (typeormDataSource._typeormExtension) return;
    typeormDataSource._typeormExtension = require('typeorm-extension');
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