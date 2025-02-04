import { shortErrorParser } from "../http/error.parser";
import logger from "./logs";


let isUncaughtExceptionHandlerEnabled = false;
export function handleUncaughtException() {
    if (isUncaughtExceptionHandlerEnabled) return;
    isUncaughtExceptionHandlerEnabled = true;
    process.on('uncaughtException', err => {
        logger.error(`Uncaught Exception: (${typeof err}): ${shortErrorParser(err)}`);
        logger.error('└', err);
    });
}