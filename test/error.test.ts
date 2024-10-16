import { errorParser, HttpException, HttpStatus, logger } from '../src';
import { ErrorResponse } from '../src/http/error.parser';
process.env.IGNORE_UNKNOWN_ERROR_PARSER_LOG = 'true';

function strObj(obj: any): string {
    if (typeof obj == 'string') return obj;
    return Object.entries(obj).filter(([key, value]) => value)
        .map(([key,value]) => key+":"+JSON.stringify(value))
        .sort().join(";;;;");
}

function test1() {
    const stringError = strObj(<ErrorResponse>{
        error: "Error 1", status: 502, errorCode: "ERR_1"
    });
    const internalServerError = strObj(<ErrorResponse>{
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "Internal Server Error",
        errorCode: "INTERNAL_SERVER_ERROR"
    });
    function checkError(err1: ErrorResponse | string, err2: string | ErrorResponse) {
        logger.log("Checking errror", err1, '...');
        if (strObj(err1) != strObj(err2)) {
            logger.error("TEST FAILED: NOT EQUALS:")
            logger.error("err1:", err1);
            logger.error("err2:", err2);
            if (typeof err1 != 'string' || typeof err1 != typeof err2) {
                logger.error("string err1:", strObj(err1));
                logger.error("string err2:", strObj(err2));
            }
            throw "TEST FAILED";
        }
    }
    checkError(errorParser(['Error 1', 502, 'ERR_1']), stringError);
    checkError(errorParser(['ERR_1', 502, 'Error 1']), stringError);
    checkError(errorParser([502, 'ERR_1', 'Error 1']), stringError);
    checkError(errorParser([502, 'Error 1', 'ERR_1']), stringError);

    checkError(errorParser('User not found'), { status: 404, error: "User not found" });
    checkError(errorParser('USER_NOT_FOUND'), { status: 404, error: "USER_NOT_FOUND", errorCode: "USER_NOT_FOUND" });
    checkError(errorParser(['Something hz', 511]), { status: 511, error: "Something hz" });
    checkError(errorParser([444, 'Something id']), { status: 444, error: "Something id" });
    checkError(errorParser(new Error("JEFE EFEOW FEWO FWE")), internalServerError);

    logger.log("Done");
    process.exit(0);
}

test1();