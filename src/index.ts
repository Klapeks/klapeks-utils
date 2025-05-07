import { catchRouterError, errorParser, ErrorResponse, shortErrorParser } from "./http/error.parser";
import { HttpException, HttpStatus, NotAuthException } from "./http/exceptions";
import HttpResponse from "./http/http.response";
import bits, { bufferBits } from "./utils/bits";
import { dataSourceOptions, getDatabaseType } from './database/dbpath.parser';
import logger, { Logger } from "./utils/logs";
import terminalColors from './utils/terminal.colors';
import utils, { assertNever } from "./utils/utils";
import { createDatabaseIfNotExists } from "./database/db.creator";
import Queue from "./states/queue";
import { DatabaseOptions } from "./database/db.types";
import { getDatabaseColumnTypes } from "./database/db.column.types";
import Intervals, { clearAsyncInterval, clearAsyncIntervals, setAsyncInterval } from "./states/intervals";
import { handleUncaughtException } from "./utils/uncaught.exception";
import { joinManyToOne, joinOneToMany, mapOf } from "./database/join.utils";
import { reactive } from "./states/reactive";
import { DeepPartial, DeepReadonly } from "./utils/types/deep.types";

export * from './utils/types/flat.types';
export * from './database/join.utils';

export {
    bits,
    bufferBits,
    utils,
    Queue,
    assertNever,
    DeepPartial,
    DeepReadonly,
    reactive,

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