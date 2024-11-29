import { NextFunction, Request, Response } from "express";
import { ValidateUser } from "../utils/broker/api";

export const requestAuthorizer = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        return res.status(403).json({ message: "authorization token not provided" })
    }

    try {
        const userData = await ValidateUser(req.headers["authorization"] as string);
        req.user = userData;
        next();
    } catch(error) {
        return res.status(403).json({ error });
    }
}