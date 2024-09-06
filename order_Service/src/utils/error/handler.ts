import { Request, Response, NextFunction } from "express";
import { logger } from "../logger";
import { NotFoundError, AuthorizationError, ValidateError } from "./errors";

export const HandleErrorWithLogger = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    let reportError = true;
    let status = 500;
    let data = error.message;

    // skip known errors
    [NotFoundError, AuthorizationError, ValidateError].forEach(
        (typeOfError) => {
            if (error instanceof typeOfError) {
                reportError = false;
                status = error.status;
                data = error.message;
            }
        },
    );

    if (reportError) {
        logger.error(error);
    } else {
        logger.warn(error); // ignore known errors
    }

    return res.status(status).json(data);
};

export const HandleUncaughtException = async (
    error: Error,
) => {
    logger.error(error);
    process.exit(1);
};