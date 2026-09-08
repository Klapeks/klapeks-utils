import { logger } from "../utils/logs";
import { assertNever } from "../utils/utils";
import { DatabaseOptions } from "./db.types";


function pickEnv(env: string, prefix?: string, env2?: string): string | undefined {
    env = env.toUpperCase();
    prefix = prefix?.toUpperCase();
    if (prefix && process.env[prefix + "_" + env]) {
        return process.env[prefix + "_" + env]
    }
    let resp = process.env['REWRITE_DATABASE_' + env]
            || process.env['APP_DATABASE_' + env]
            || process.env['DATABASE_' + env]
    if (!resp && env2) resp = pickEnv(env2, prefix);
    return resp;
}
function requiredPickEnv(env: string, prefix?: string, env2?: string) {
    env = env.toUpperCase();
    let r = pickEnv(env, prefix, env2);
    if (r) return r;
    r = 'No or invalid DATABASE_' + env
        + ' in environment variables';
    logger.error(r);
    throw new Error(r);
}

let _env_database_type: DatabaseOptions['type'] | undefined;
export function getEnvDatabaseType(): DatabaseOptions['type'] {
    if (_env_database_type) return _env_database_type;
    _env_database_type = requiredPickEnv('type') as DatabaseOptions['type'];
    return _env_database_type;
}

export function dataSourceOptions(): DatabaseOptions {
    const dbType = getEnvDatabaseType();
    const logging = pickEnv('log_sql') == 'true'
        || pickEnv('sql_log') == 'true'
        || pickEnv('sql_debug') == 'true'
        || pickEnv('debug_sql') == 'true';

    if (dbType == 'sqlite') {
        return {
            type: 'sqlite',
            logging: logging,
            database: requiredPickEnv('path', 'sqlite'),
            charset: pickEnv('charset', 'sqlite'),
        }
    }
    if (dbType == 'mysql' || dbType == 'postgres' || dbType == 'mssql') {
        const extraOptions = dbType === 'mssql' ? {
            useUTC: pickEnv('options_use_utc', 'mssql') == 'true',
            trustServerCertificate: pickEnv(
                'options_trust_server_certificate',
                'mssql') == 'false' ? false : true,
            encrypt: pickEnv('options_encrypt', 'mssql') == 'false' ? false : true,
        } : undefined;
        return {
            type: dbType,
            logging: logging,
            host: requiredPickEnv("host", dbType, 'ip'),
            port: Number(requiredPickEnv('port', dbType)),
            database: requiredPickEnv('name', dbType),
            username: requiredPickEnv('login', dbType, 'user'),
            password: pickEnv('password', dbType),
            charset: pickEnv('charset', dbType),
            options: extraOptions,
            extra: extraOptions,
        }
    }
    assertNever(dbType, 'Invalid database type: ' + dbType);
}
