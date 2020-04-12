import * as jwt from "jsonwebtoken";
import { INVALID_AUTH } from "../constants/errorCodes";
import * as bcrypt from "bcrypt";
import { Request } from "../types";
import { config } from "dotenv";

config();

export const getAuthData = (
    req: Request
): {
    token: string;
    data: string | object;
} | null => {
    const header = req.connection
        ? req.connection.context.Authorization
        : req.req.headers.authorization;

    if (header) {
        const token = header.replace("Bearer ", "");
        const data = jwt.verify(token, <string>process.env.JWT_KEY);

        return { token, data };
    }

    return null;
};

export const getUserId = (req: Request): string => {
    const authData: any = getAuthData(req);
    return authData ? authData.data.id : null;
};

export const signJwt = (id: string): string =>
    jwt.sign({ id }, <string>process.env.JWT_KEY, {
        expiresIn: "3h"
    });

export const hashPassword = (password: string): string =>
    bcrypt.hashSync(password, 10);