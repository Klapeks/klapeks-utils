import { catchRouterError, errorParser, ErrorResponse, shortErrorParser } from "./http/error.parser";
import { HttpException, HttpStatus, NotAuthException } from "./http/exceptions";
import HttpResponse from "./http/http.response";
import bits, { bufferBits } from "./utils/bits";
import { dataSourceOptions, DatabaseOptions } from './database/dbpath.parser';
import logger, { Logger } from "./utils/logs";
import terminalColors from './utils/terminal.colors';
import utils, { assertNever, DeepPartial } from "./utils/utils";
import { createDatabaseIfNotExists } from "./database/db.creator";
import Queue from "./utils/queue";

export {
    bits,
    bufferBits,
    utils,
    Queue,
    assertNever,
    DeepPartial,

    logger,
    Logger,
    terminalColors,

    dataSourceOptions,
    createDatabaseIfNotExists,
    DatabaseOptions,

    HttpStatus,
    HttpException,
    NotAuthException,
    HttpResponse,
    errorParser,
    ErrorResponse,
    catchRouterError,
    shortErrorParser
}