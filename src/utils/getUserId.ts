import * as jwt from "jsonwebtoken";
import { Request } from "../types";
import { config } from "dotenv";

config();

const getAuthData = (
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

const getUserId = (req: Request): string => {
    const authData: any = getAuthData(req);
    return authData ? authData.data.id : null;
};

export default getUserId;
