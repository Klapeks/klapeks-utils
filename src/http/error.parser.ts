import logger from "../utils/logs";
import { HttpException, HttpStatus } from "./exceptions";

export function errorParser(e: any, raw = false): { status: number, error: any } {
    if (e instanceof HttpException) {
        return { status: e.status, error: e.response || e.message };
    }
    if (typeof e == 'object' && 'isAxiosError' in e) {
        const status = e.response?.status || e.status || 400;
        return e?.response?.data || { 
            status, error: "AxiosError: " + e?.message || e 
        };
    }
    let code = 0;
    if (Array.isArray(e) && e.length == 2) {
        // if first argument is number
        if (+e[0]) {
            code = +e[0];
            e = e[1];
        }
        // if second argument is number
        else if (+e[1]) {
            code = +e[1];
            e = e[0];
        }
        // else both is string
        else {
            e = e[0] + ' ' + e[1];
        }
    }

    if (!code && typeof e === "string") {
        if (e.includes("found")) {
            code = HttpStatus.NOT_FOUND;
        } else code = HttpStatus.BAD_REQUEST;
        if (raw) return { error: e, status: code || 500 };
    }
    if (raw) return undefined as any;
    
    if (!code) {
        logger.error("Unknown error-parser error:", e);
        e = "Internal Server Error";
        code = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return { status: code, error: e };
}

export function catchRouterError(e: any, res: any) {
    e = errorParser(e);
    res.status(e.status || 500).send(e);
}

export function shortErrorParser(err: any) {
    if (!err) return 'undefined error';
    return errorParser(err, true)?.error || err.message || err;
}