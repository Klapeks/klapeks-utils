import { DatabaseOptions } from "./db.types";
import { getDatabaseType } from "./dbpath.parser"


interface IDatabaseColumnTypesList {
    dbtype: DatabaseOptions['type'],
    int32: "integer" | "int",
    bigint: "bigint" | "integer",
    float32: "float" | "double",
    float64: "float" | "double",
    string: "varchar" | "nvarchar" | "character varying" | "text",
    boolean: "bit" | "tinyint" | "boolean" | "integer",
    enum: "enum" | "simple-enum",
    datetime: "datetime" | "timestamp" | "datetime2",
    json: "json" | "simple-json",
}
export type IDatabaseKnownColumnTypes = IDatabaseColumnTypesList[keyof Omit<IDatabaseColumnTypesList, "dbtype">];

// https://github.com/typeorm/typeorm/blob/master/src/driver/mysql/MysqlDriver.ts#L750
// https://github.com/typeorm/typeorm/blob/master/src/driver/sqlserver/SqlServerDriver.ts#L678
const databaseColumnTypes = {
    "sqlite": {
        dbtype: "sqlite",
        int32: "integer",
        bigint: "integer",
        float32: "float",
        float64: "double",
        string: "text",
        boolean: "integer",
        enum: "simple-enum",
        datetime: "datetime",
        json: "simple-json",
    },
    "mysql": {
        dbtype: "mysql",
        int32: "int",
        bigint: "bigint",
        float32: "float",
        float64: "double",
        string: "varchar",
        boolean: "tinyint",
        enum: "enum",
        datetime: "datetime",
        json: "json",
    },
    "mssql": {
        dbtype: "sqlite",
        int32: "int",
        bigint: "bigint",
        float32: "float",
        float64: "float",
        string: "nvarchar",
        boolean: "bit",
        enum: "simple-enum",
        datetime: "datetime2",
        json: "simple-json",
    },
    "postgres": {
        dbtype: "postgres",
        int32: "integer",
        bigint: "bigint",
        float32: "float",
        float64: "double",
        string: "character varying",
        boolean: "boolean",
        enum: "enum",
        datetime: "timestamp",
        json: "json",
    },
} satisfies { 
    [key in DatabaseOptions['type']]: IDatabaseColumnTypesList
}

export function getDatabaseColumnTypes(): {
    dbtype: DatabaseOptions['type'],
    int32: "integer" | "int",
    string: "varchar" | "nvarchar" | "character varying" | "text",
    boolean: "bit" | "tinyint" | "boolean" | "integer",
    enum: "enum" | "simple-enum",
    bigint: "bigint" | "integer",
    datetime: "datetime" | "timestamp" | "datetime2",
    float32: "float" | "double",
    float64: "float" | "double",
    json: "json" | "simple-json",
} {
    const type = getDatabaseType();
    if (databaseColumnTypes[type]) {
        return databaseColumnTypes[type];
    }
    throw 'Unknown database type: ' + type;
}

export function getRawDatabaseColumnTypeOfTypeORM(dbtype: DatabaseOptions['type'], typeormType: any) {
    if (typeormType === Number) return databaseColumnTypes[dbtype].int32;
    if (typeormType === String) return databaseColumnTypes[dbtype].string;
    if (typeormType === Boolean) return databaseColumnTypes[dbtype].boolean;
    if (typeormType === 'bigint') return databaseColumnTypes[dbtype].bigint;
    if (typeormType === Date) return databaseColumnTypes[dbtype].datetime;
    return typeormType as IDatabaseKnownColumnTypes;
}