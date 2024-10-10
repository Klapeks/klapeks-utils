import logger from "./logs";
import { assertNever } from "./utils";

interface AuthDB {
    host: string,
    port: number,
    username: string,
    password?: string,
    database: string,
}

type MySQLOptions = {
    type: "mysql",
    logging: boolean
} & AuthDB;

export type DatabaseOptions = {
    type: "sqlite",
    database: string,
    logging: boolean
} | MySQLOptions;

function pickEnv(env: string, prefix?: string) {
    env = env.toUpperCase();
    prefix = prefix?.toUpperCase();
    if (prefix && process.env[prefix+"_"+env]) {
        return process.env[prefix+"_"+env]
    }
    return process.env['APP_DATABASE_'+env] 
        || process.env['DATABASE_'+env];
}
function rPickEnv(env: string, prefix?: string) {
    env = env.toUpperCase();
    let r = pickEnv(env);
    if (r) return r;
    r = 'No or invalid DATABASE_' + env 
        + ' in environment variables';
    logger.error(r);
    throw new Error(r);
}

export function dataSourceOptions(): DatabaseOptions {
    const type = pickEnv('type') as DatabaseOptions['type'];
    const logging = pickEnv('log_sql') == 'true'
                 || pickEnv('sql_log') == 'true';
                 
    if (type == 'sqlite') return {
        type: 'sqlite', logging,
        database: rPickEnv('path', 'sqlite'),
    }
    if (type == 'mysql') return {
        type, logging,
        host: rPickEnv("host", "mysql"),
        port: +rPickEnv('port', "mysql"),
        database: rPickEnv('name', "mysql"),
        username: rPickEnv('login', "mysql"),
        password: pickEnv('password', "mysql"),
    }
    assertNever(type, 'Invalid database type: ' + type);
}
