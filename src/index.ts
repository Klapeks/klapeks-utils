import { catchRouterError, errorParser, ErrorResponse, shortErrorParser } from "./http/error.parser";
import { HttpException, HttpStatus, NotAuthException } from "./http/exceptions";
import HttpResponse from "./http/http.response";
import bits, { bufferBits } from "./utils/bits";
import { dataSourceOptions, getDatabaseType } from './database/dbpath.parser';
import logger, { Logger } from "./utils/logs";
import terminalColors from './utils/terminal.colors';
import utils, { assertNever, DeepPartial } from "./utils/utils";
import { createDatabaseIfNotExists } from "./database/db.creator";
import Queue from "./utils/queue";
import { DatabaseOptions } from "./database/db.types";
import { getDatabaseColumnTypes } from "./database/db.column.types";
import Intervals, { clearAsyncInterval, clearAsyncIntervals, setAsyncInterval } from "./utils/intervals";
import { handleUncaughtException } from "./utils/uncaught.exception";

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

    getDatabaseType,
    dataSourceOptions,
    createDatabaseIfNotExists,
    DatabaseOptions,
    getDatabaseColumnTypes,

    HttpStatus,
    HttpException,
    NotAuthException,
    HttpResponse,
    errorParser,
    ErrorResponse,
    catchRouterError,
    shortErrorParser,

    Intervals,
    setAsyncInterval,
    clearAsyncIntervals,
    clearAsyncInterval,
    handleUncaughtException
}