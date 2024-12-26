import { assertNever } from "../utils/utils";
import { getDatabaseType } from "./dbpath.parser"



export function getDatabaseColumnTypes(): {
    enum: "enum" | "simple-enum",
    datetime: "datetime" | "timestamp"
} {
    const type = getDatabaseType();
    switch (type) {
        case "sqlite": return {
            enum: "simple-enum",
            datetime: "datetime"
        }
        case "mysql": return {
            enum: "enum",
            datetime: "datetime"
        }
        case "postgres": return {
            enum: "enum",
            datetime: "timestamp"
        }
        default: assertNever(type, 'Unknown database type: ' + type);
    }
}