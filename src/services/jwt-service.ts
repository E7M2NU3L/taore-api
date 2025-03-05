import 'dotenv/config';
import jwt from "jsonwebtoken";

export class JwtService {
    secretKey = process.env.TOKEN_SECRET ?? "";
    constructor() {}

    generateToken(payload: any) {
        return jwt.sign(payload, this.secretKey, { expiresIn: '3d' });
    }

    verifyToken(token: string) {
        return jwt.verify(token, this.secretKey);
    }
}