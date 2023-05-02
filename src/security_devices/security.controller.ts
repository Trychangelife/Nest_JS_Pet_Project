import { Controller, Delete, Get, HttpException, HttpStatus, Req } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { JwtServiceClass } from "src/Auth_guards/jwt.service";
import { RefreshTokenStorageType } from "src/types/types";
import { UsersRepository } from "src/users/users.repository";
import { SecurityDeviceService } from "./security.service";

@Controller('security')
export class SecurityDeviceController {

    constructor(
        protected jwtServiceClass: JwtServiceClass,
        protected usersRepository: UsersRepository, 
        protected securityService: SecurityDeviceService,
        @InjectModel('RefreshToken') protected refreshTokenModel: Model<RefreshTokenStorageType>) {
    }
    //GET - список всех активных сессий пользователя
    @Get('devices')
    async returnAllDevices(@Req() req ) {
        const refreshToken = req.cookies["refreshToken"];
        const token = req.headers.authorization.split(' ')[1]
        const userId = await this.jwtServiceClass.getUserByToken(token)
        if (!refreshToken) {
            throw new HttpException('Refresh token not found, where you cookie?', HttpStatus.UNAUTHORIZED)
        }
        const resultAllDevice = await this.securityService.returnAllDevices(userId)
        return resultAllDevice
    }
    //DELETE - удаление всех других (кроме текущей) сессий
    @Delete('devices')
    async terminateAllSession(@Req() req ) {
        const foundUser = await this.usersRepository.findUserByLoginForMe(req.user.login);
        return foundUser
    }
    //DELETE - удаление конкретной сессии по deviceId
    @Delete('devices/:id')
    async terminateTargetSessionById(@Req() req) {
        const foundUser = await this.usersRepository.findUserByLoginForMe(req.user.login);
        return foundUser
    }
}
 