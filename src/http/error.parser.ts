import logger from "../utils/logs";
import { HttpException, HttpStatus } from "./exceptions";

export interface ErrorResponse {
    status: number,
    error: string,
    errorCode?: string
}

export function errorParser(e: any, raw = false): ErrorResponse {
    // --- utils ---
    if (e instanceof HttpException) return e.asResponse();

    // --- axios ---
    if (typeof e == 'object' && 'isAxiosError' in e) {
        const status = e.response?.status || e.status || 400;
        if (e?.response?.data) return e?.response?.data;
        return { 
            status, errorCode: "SERVER_AXIOS_ERROR",
            error: "AxiosError: " + e?.message || e 
        };
    }

    // --- array parse: [err, status, errCode] ---
    let code = 0;
    let errorCode = undefined as string | undefined;
    if (Array.isArray(e)) {
        // if error in first position
        if (Number(e[0])) {
            code = e[0];
            e[0] = e[1];
            e[1] = code;
        }
        // if [errCode, status, err]
        if (e.length >= 3 && typeof e[0] == 'string') {
            if (!e[0].includes(' ')) {
                errorCode = e[0];
                e[0] = e[2];
                e[2] = errorCode;
            }
        }
        errorCode = e[2];
        code = e[1];
        e = e[0];
    }

    if (typeof e == 'string' && !e.includes(' ')) errorCode = e;

    if (!code && typeof e === "string") {
        if (e.toLowerCase().includes("found")) {
            code = HttpStatus.NOT_FOUND;
        } else {
            code = HttpStatus.BAD_REQUEST;
        }
        if (raw) return { error: e, status: code || 500 };
    }
    if (raw) return undefined as any;
    
    if (!code) {
        if (process.env.IGNORE_UNKNOWN_ERROR_PARSER_LOG == 'true') {}
        else logger.warn("Unknown error-parser error:", e);
        return {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: "Internal Server Error",
            errorCode: "INTERNAL_SERVER_ERROR"
        }
    }
    return { status: code, error: e, errorCode };
}

export function catchRouterError(e: any, res: any) {
    e = errorParser(e);
    res.status(e.status || 500).send(e);
}

export function shortErrorParser(err: any) {
    if (!err) return 'undefined error';
    return errorParser(err, true)?.error || err.message || err;
}