import logger from "../utils/logs";
import { assertNever } from "../utils/utils";

interface AuthDB {
    host: string,
    port: number,
    username: string,
    password?: string,
    database: string,
    charset?: any
}

type MySQLOptions = {
    type: "mysql",
    logging: boolean
} & AuthDB;

export type  DatabaseOptions = {
    type: "sqlite",
    database: string,
    logging: boolean,
    charset?: string
} | MySQLOptions;

function pickEnv(env: string, prefix?: string, env2?: string): string | undefined {
    env = env.toUpperCase();
    prefix = prefix?.toUpperCase();
    if (prefix && process.env[prefix+"_"+env]) {
        return process.env[prefix+"_"+env]
    }
    let resp = process.env['REWRITE_DATABASE_'+env] 
            || process.env['APP_DATABASE_'+env] 
            || process.env['DATABASE_'+env]
    if (!resp && env2) resp = pickEnv(env2, prefix);
    return resp;
}
function rPickEnv(env: string, prefix?: string, env2?: string) {
    env = env.toUpperCase();
    let r = pickEnv(env, prefix, env2);
    if (r) return r;
    r = 'No or invalid DATABASE_' + env 
        + ' in environment variables';
    logger.error(r);
    throw new Error(r);
}

let _database_type: DatabaseOptions['type'] | undefined;
export function getDatabaseType(): DatabaseOptions['type'] {
    if (_database_type) return _database_type;
    _database_type = pickEnv('type') as DatabaseOptions['type'];
    return _database_type;
}

export function dataSourceOptions(): DatabaseOptions {
    const type = getDatabaseType();
    const logging = pickEnv('log_sql') == 'true'
                 || pickEnv('sql_log') == 'true';
                 
    if (type == 'sqlite') return {
        type: 'sqlite', logging,
        database: rPickEnv('path', 'sqlite'),
        charset: pickEnv('charset', 'sqlite'),
    }
    if (type == 'mysql') return {
        type, logging,
        host: rPickEnv("host", "mysql", 'ip'),
        port: Number(rPickEnv('port', "mysql")),
        database: rPickEnv('name', "mysql"),
        username: rPickEnv('login', "mysql", 'user'),
        password: pickEnv('password', "mysql"),
        charset: pickEnv('charset', 'mysql'),
    }
    assertNever(type, 'Invalid database type: ' + type);
}
