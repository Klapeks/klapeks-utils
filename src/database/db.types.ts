
export interface AuthDatabases {
    type: "mysql" | "postgres" | "mssql",

    host: string,
    port: number,

    username: string,
    password?: string,

    database: string,
    charset?: any
    logging: boolean
}

export type DatabaseOptions = {
    type: "sqlite",
    database: string,
    logging: boolean,
    charset?: string
} | AuthDatabases;