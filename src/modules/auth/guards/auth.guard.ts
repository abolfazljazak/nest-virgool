import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { isJWT } from "class-validator";
import { Request } from "express";
import { Observable } from "rxjs";
import { AuthMessage } from "src/common/enum/message.enum";
import { AuthService } from "../auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService) {}
    async canActivate(context: ExecutionContext) {
        const httpContext = context.switchToHttp()
        const request: Request = httpContext.getNext<Request>()
        const {authorization} = request.headers
        if(!authorization || authorization?.trim() == "")
            throw new UnauthorizedException(AuthMessage.LoginRequired)

        const [bearer, token] = authorization?.split(" ")
        if (bearer?.toLowerCase() !== "bearer" || !token || isJWT(token))
            throw new UnauthorizedException(AuthMessage.LoginRequired)
        request.user = await this.authService.validateAccessToken(token)

        return true
    }
}   