import { Controller, Delete, Get, Request } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { RefreshTokenStorageType } from "src/types/types";
import { UsersRepository } from "src/users/users.repository";

@Controller('security')
export class AuthController {

    constructor(
        protected usersRepository: UsersRepository, 
        @InjectModel('RefreshToken') protected refreshTokenModel: Model<RefreshTokenStorageType>) {
    }
    @Get('devices')
    async returnAllDevices(@Request() req ) {
        const foundUser = await this.usersRepository.findUserByLoginForMe(req.user.login);
        return foundUser
    }
    @Delete('devices')
    async terminateAllSession(@Request() req ) {
        const foundUser = await this.usersRepository.findUserByLoginForMe(req.user.login);
        return foundUser
    }
    @Delete('devices:id')
    async terminateTargetSessionById(@Request() req ) {
        const foundUser = await this.usersRepository.findUserByLoginForMe(req.user.login);
        return foundUser
    }
}
