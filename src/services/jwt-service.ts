import 'dotenv/config';
import jwt from "jsonwebtoken";

class JwtService {
    secretKey = process.env.TOKEN_SECRET ?? "";
    constructor() {}

    generateToken(payload: any) {
        return jwt.sign(payload, this.secretKey, { expiresIn: '1h' });
    }

    verifyToken(token: string) {
        return jwt.verify(token, this.secretKey);
    }
}

export default JwtService;