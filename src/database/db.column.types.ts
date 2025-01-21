import { assertNever } from "../utils/utils";
import { DatabaseOptions } from "./db.types";
import { getDatabaseType } from "./dbpath.parser"


export function getDatabaseColumnTypes(): {
    dbtype: DatabaseOptions['type'],
    enum: "enum" | "simple-enum",
    datetime: "datetime" | "timestamp",
} {
    const type = getDatabaseType();
    switch (type) {
        case "sqlite": return {
            dbtype: type,
            enum: "simple-enum",
            datetime: "datetime"
        }
        case "mysql": return {
            dbtype: type,
            enum: "enum",
            datetime: "datetime"
        }
        case "postgres": return {
            dbtype: type,
            enum: "enum",
            datetime: "timestamp"
        }
        default: assertNever(type, 'Unknown database type: ' + type);
    }
}