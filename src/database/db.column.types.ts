import { assertNever } from "../utils/utils";
import { DatabaseOptions } from "./db.types";
import { getDatabaseType } from "./dbpath.parser"


export function getDatabaseColumnTypes(): {
    dbtype: DatabaseOptions['type'],
    enum: "enum" | "simple-enum",
    datetime: "datetime" | "timestamp" | "datetime2",
    float32: "float" | "double",
    float64: "float" | "double",
    json: "json" | "simple-json",
} {
    const type = getDatabaseType();
    switch (type) {
        case "sqlite": return {
            dbtype: type,
            enum: "simple-enum",
            datetime: "datetime",
            float32: "float",
            float64: "double",
            json: "simple-json"
        }
        case "mysql": return {
            dbtype: type,
            enum: "enum",
            datetime: "datetime",
            float32: "float",
            float64: "double",
            json: "json"
        }
        case "postgres": return {
            dbtype: type,
            enum: "enum",
            datetime: "timestamp",
            float32: "float",
            float64: "double",
            json: "json"
        }
        case "mssql": return {
            dbtype: type,
            enum: "simple-enum",
            datetime: "datetime2",
            float32: "float",
            float64: "float",
            json: "simple-json"
        }
        default: assertNever(type, 'Unknown database type: ' + type);
    }
}