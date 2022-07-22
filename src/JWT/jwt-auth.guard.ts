import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtModule, JwtSecretRequestType, JwtService, JwtVerifyOptions } from "@nestjs/jwt";
import { UsersType } from "src/types/types";
import { UsersService } from "src/users/users.service";
import { JwtServiceClass } from "./jwt.service";

export interface IGetUserAuthInfoRequest extends Request {
    user: UsersType | null
}

@Injectable()
export class JwtAuthGuard implements CanActivate {

    
    constructor (
                protected jwtServiceClass: JwtServiceClass,
                protected usersService: UsersService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const req = context.switchToHttp().getRequest()
            const bearer = req.headers.authorization.split(' ')[0]
            const token = req.headers.authorization.split(' ')[1]
            if (bearer !== "Bearer" || !token) {
                throw new UnauthorizedException({message: "Пользователь не авторизован"})
            }
            const userId = await this.jwtServiceClass.getUserByToken(token)
            if (userId) {
                const user =  await this.usersService.findUserById(userId)
                req.user = user;
                return true
            }
        }
        catch (e) {
            return false
        }
}
}