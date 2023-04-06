import { EmailService } from "src/email/email.service";
import { UsersRepository } from "src/users/users.repository";
import { UsersService } from "src/users/users.service";
import { AuthService } from "./auth.service";
import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, Put, Query, Req, Res, UseGuards } from "@nestjs/common";
import { CreateUser, RefreshTokenStorageType, UsersType } from "src/types/types";
import { Injectable, Ip, Request } from "@nestjs/common";
import { JwtServiceClass } from "src/Auth_guards/jwt.service";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { JwtAuthGuard } from "src/Auth_guards/jwt-auth.guard";
import { IsNotEmpty, MaxLength, MinLength } from "class-validator";
import { STATUS_CODES } from "http";


class AuthForm {
    @IsNotEmpty()
    login: string
    @MinLength(6)
    @MaxLength(20)
    password: string
}

@Controller('auth')
export class AuthController {

    constructor(
        protected usersRepository: UsersRepository, 
        protected usersService: UsersService, 
        protected authService: AuthService, 
        protected emailService: EmailService, 
        protected jwtService: JwtServiceClass,
        @InjectModel('RefreshToken') protected refreshTokenModel: Model<RefreshTokenStorageType>) {
    }
    @Post('login')
    async authorization(@Request() req: {ip: string}, @Body() DataUser: AuthForm, @Res() res) {
        await this.authService.informationAboutAuth(req.ip, DataUser.login);
        const checkIP = await this.authService.counterAttemptAuth(req.ip, DataUser.login);
        if (checkIP) {
            const user = await this.usersService.checkCredentials(DataUser.login, DataUser.password);
            const foundUser = await this.usersRepository.findUserByLogin(DataUser.login);
            if (!user) {
                throw new HttpException("UNAUTHORIZED", HttpStatus.UNAUTHORIZED)
            }
            else if (foundUser && user) {
                const accessToken = await this.jwtService.accessToken(foundUser);
                const refreshToken = await this.jwtService.refreshToken(foundUser);
                res
                .cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production"
                })
                .status(200)
                .send({ accessToken });
            }
            else {
                throw new HttpException("Something wrong", HttpStatus.BAD_REQUEST);
            }
        }
        else {
            throw new HttpException("To many requests", HttpStatus.TOO_MANY_REQUESTS);
        }
    }
    @Post('refresh-token')
    async updateAccessToken(@Req() req, @Res() res) {
        const refreshToken = req.cookies["refreshToken"];
        if (!refreshToken) {
            throw new HttpException('Refresh token not found, where you cookie?', HttpStatus.UNAUTHORIZED)
        }
        else if (refreshToken) {
            const newAccessToken: any = await this.jwtService.getNewAccessToken(refreshToken);
            if (newAccessToken !== null) {
                res
                 .cookie("refreshToken", newAccessToken.newRefreshToken, {
                     httpOnly: true,
                     secure: process.env.NODE_ENV === "production"
                 })
                .status(200)
                .send({accessToken: newAccessToken.newAccessToken});
            }
            else {
                throw new HttpException('Refresh Token already not valid, repeat authorization', HttpStatus.UNAUTHORIZED)
            }
        } 
        else {
            throw new HttpException("Something wrong", HttpStatus.BAD_REQUEST)
        }
    }
    @Post('registration')
    async registration(@Body() user: {password: string, login: string, email: string},  @Request() req: {ip: string}, @Res() res ) {
        const result: UsersType | null | boolean = await this.usersService.createUser(user.password, user.login, user.email, req.ip);
        if (result == false) {
            throw new HttpException("Login or email already use", HttpStatus.BAD_REQUEST)
        }
        else if (result == null) {
            throw new HttpException("To many requests", HttpStatus.TOO_MANY_REQUESTS)
        }
        else {
            res 
            .status(204)
            .send(result)
        }
    }
    @Post('registration-confirmation')
    async registrationConfirmation(@Body() body: {code: string}, @Request() req: {ip: string}) {
        await this.authService.informationAboutConfirmed(req.ip, body.code);
        const checkInputCode = await this.authService.counterAttemptConfirm(req.ip, body.code);
        if (checkInputCode) {
            const activationResult = await this.usersService.confirmationEmail(body.code);
            if (activationResult) {
                return checkInputCode
            }
            else {
                throw new HttpException("Invalide Code", HttpStatus.BAD_REQUEST)
            }
        }
        else {
            throw new HttpException("To many requests", HttpStatus.TOO_MANY_REQUESTS)
        }
    }
    @Post('registration-email-resending')
    async registrationEmailResending(@Body() user: {password: string, login: string, email: string},  @Request() req: {ip: string}) {
        await this.authService.informationAboutEmailSend(req.ip, user.email);
        const checkAttemptEmail = await this.authService.counterAttemptEmail(req.ip, user.email);
        if (checkAttemptEmail) {
            await this.authService.refreshActivationCode(user.email);
            const emailResending = await this.emailService.emailConfirmation(user.email);
            if (emailResending) {
                throw new HttpException("Email send succefully", HttpStatus.ACCEPTED);
            }
            else {
                throw new HttpException({ message: "account already activated", field: "email" }, HttpStatus.BAD_REQUEST)
            }
        }
        else {
            throw new HttpException("To many requests", HttpStatus.TOO_MANY_REQUESTS)
        }
    }
    @Post('logout')
    async logout(@Req() req) {
        const refreshTokenInCookie = req.cookies.refreshToken
        const checkRefreshToken = await this.jwtService.checkRefreshToken(refreshTokenInCookie)
        const findTokenInData = await this.refreshTokenModel.findOne({refreshToken: refreshTokenInCookie})
        if (refreshTokenInCookie && checkRefreshToken !== false && findTokenInData !== null) {
            await this.refreshTokenModel.findOneAndDelete({refreshToken: refreshTokenInCookie})
            throw new HttpException("Logout succefully, bye!", HttpStatus.NO_CONTENT)
        }
        else {
            throw new HttpException("Sorry, you already logout, repeat authorization", HttpStatus.BAD_REQUEST)
        }
    }
    @UseGuards(JwtAuthGuard)
    @Get('me')
    async aboutMe(@Body() @Request() req) {
        const foundUser = await this.usersRepository.findUserByLoginForMe(req.user.login);
        return foundUser
    }
    @Get('get-registration-date')
    async getRegistrationDate() {
        const registrationData = await this.usersRepository.getRegistrationDate();
        return registrationData
    }
    @Get('get-auth-date')
    async getAuthDate() {
        const authData = await this.usersRepository.getAuthDate();
        return authData;
    }
    @Get('get-confirm-date')
    async getConfirmDate() {
        const confrimData = await this.usersRepository.getConfirmAttemptDate();
        return confrimData;
    }
    @Get('get-email-date')
    async getEmailDate() {
        const emailSendData = await this.usersRepository.getEmailSendDate();
        return emailSendData;
    }
    @Get('get-token-date')
    async getTokenDate() {
        const TokenData = await this.usersRepository.getTokenDate();
        return TokenData;
    }
}
