import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CookiePayload } from "./types/payload";

@Injectable()
export class TokenService {
    constructor(
        private jwtService: JwtService
    ) {}

    createOtpToken(payload: CookiePayload) {
        const token = this.jwtService.sign(payload, {
            secret: process.env.OTP_TOKEN_SECRET,
            expiresIn: 60 * 2
        })
        return token
    }
}