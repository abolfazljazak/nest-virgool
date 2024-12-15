import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthType } from './enums/type.enum';
import { AuthMethod } from './enums/method.enum';
import { isEmail, isMobilePhone } from 'class-validator';

@Injectable()
export class AuthService {
    userExistence(authDto: AuthDto) {
        const {type, username, method} = authDto
        switch (type) {
            case AuthType.Register:
                return this.register(method, username)

            case AuthType.Login:
                return this.login(method, username)
        
            default:
                throw new UnauthorizedException()
        }
    }

    login(method: AuthMethod, username: string) {
        return this.usernameValidator(method, username)
    }

    register(method: AuthMethod, username: string) {
        return this.usernameValidator(method, username)
    }

    usernameValidator(method: AuthMethod, username: string) {
        switch (method) {
            case AuthMethod.Email:
                if(isEmail(username)) return username
                throw new BadRequestException("email format is incorrect")
            case AuthMethod.Phone:
                if (isMobilePhone(username, "fa-IR")) return username
                throw new BadRequestException("mobile number is incorrect")
            case AuthMethod.Username:
                return username
            default:
                throw new UnauthorizedException("username data is not valid")
        }
    }
}
