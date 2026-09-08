import { DatabaseOptions } from "./db.types";
import { getEnvDatabaseType } from "./dbpath.parser"

// export type IDatabaseColumnType = "integer" | "int" | "bigint"
//     | "float" | "double" | "text" | "varchar" | "nvarchar" | "character varying"
//     | "bit" | "tinyint" | "boolean" | "enum" | "simple-enum" 
//     | "datetime" | "timestamp" | "datetime2" | "json" | "simple-json";

interface IDatabaseColumnTypesList {
    dbtype: DatabaseOptions['type'],
    int32: "integer" | "int",
    bigint: "bigint" | "integer",
    float32: "float" | "double",
    float64: "float" | "double",
    string: "varchar" | "nvarchar" | "character varying",
    boolean: "bit" | "tinyint" | "boolean" | "integer",
    datetime: "datetime" | "timestamp" | "datetime2",
    enum_typeorm: "enum" | "simple-enum",
    enum_raw_sql: "enum" | "varchar" | "nvarchar",
    json_typeorm: "json" | "simple-json",
    json_raw_sql: "json" | "text" | "ntext",
}
export type IDatabaseKnownColumnTypes = IDatabaseColumnTypesList[keyof Omit<IDatabaseColumnTypesList, "dbtype">];

// https://github.com/typeorm/typeorm/blob/master/src/driver/mysql/MysqlDriver.ts#L750
// https://github.com/typeorm/typeorm/blob/master/src/driver/sqlserver/SqlServerDriver.ts#L678
// https://github.com/typeorm/typeorm/blob/master/src/driver/sqlite-abstract/AbstractSqliteDriver.ts#L658
// https://github.com/typeorm/typeorm/blob/master/src/driver/postgres/PostgresDriver.ts#L1149
const databaseColumnTypes = {
    "sqlite": {
        dbtype: "sqlite",
        int32: "integer",
        bigint: "integer",
        float32: "float",
        float64: "double",
        string: "varchar",
        boolean: "boolean",
        datetime: "datetime",
        enum_typeorm: "simple-enum",
        enum_raw_sql: "varchar",
        json_typeorm: "simple-json",
        json_raw_sql: "text",
    },
    "mysql": {
        dbtype: "mysql",
        int32: "int",
        bigint: "bigint",
        float32: "float",
        float64: "double",
        string: "varchar",
        boolean: "tinyint",
        datetime: "datetime",
        enum_typeorm: "enum",
        enum_raw_sql: "enum",
        json_typeorm: "json",
        json_raw_sql: "json",
    },
    "mssql": {
        dbtype: "sqlite",
        int32: "int",
        bigint: "bigint",
        float32: "float",
        float64: "float",
        string: "nvarchar",
        boolean: "bit",
        datetime: "datetime2",
        enum_typeorm: "simple-enum",
        enum_raw_sql: "nvarchar",
        json_typeorm: "simple-json",
        json_raw_sql: "ntext",
    },
    "postgres": {
        dbtype: "postgres",
        int32: "integer",
        bigint: "bigint",
        float32: "float",
        float64: "double",
        string: "character varying",
        boolean: "boolean",
        datetime: "timestamp",
        enum_typeorm: "enum",
        enum_raw_sql: "enum",
        json_typeorm: "json",
        json_raw_sql: "json",
    },
} satisfies { 
    [key in DatabaseOptions['type']]: IDatabaseColumnTypesList
}

export function getEnvDatabaseColumnTypes(): IDatabaseColumnTypesList {
    const dbType = getEnvDatabaseType();
    if (databaseColumnTypes[dbType]) {
        return databaseColumnTypes[dbType];
    }
    throw 'Unknown database type: ' + dbType;
}

export function getRawDatabaseColumnTypeOfTypeORM(dbtype: DatabaseOptions['type'], typeormType: any) {
    if (typeormType === Number) return databaseColumnTypes[dbtype].int32;
    if (typeormType === String) return databaseColumnTypes[dbtype].string;
    if (typeormType === Boolean) return databaseColumnTypes[dbtype].boolean;
    if (typeormType === Date) return databaseColumnTypes[dbtype].datetime;
    if (typeormType === 'bigint') return databaseColumnTypes[dbtype].bigint;
    if (typeormType === 'simple-enum') return databaseColumnTypes[dbtype].enum_raw_sql;
    if (typeormType === 'simple-json') return databaseColumnTypes[dbtype].json_raw_sql;
    return typeormType as IDatabaseKnownColumnTypes;
}