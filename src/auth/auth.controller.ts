import { EmailService } from "src/email/email.service";
import { UsersRepository } from "src/users/users.repository";
import { UsersService } from "src/users/users.service";
import { AuthService } from "./auth.service";
import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, HttpCode, HttpException, HttpStatus, Param, Post, Put, Query, Req, Res, UseFilters, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateUser, RefreshTokenStorageType, UsersType } from "src/types/types";
import { Injectable, Ip, Request } from "@nestjs/common";
import { JwtServiceClass } from "src/Auth_guards/jwt.service";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { JwtAuthGuard } from "src/Auth_guards/jwt-auth.guard";
import { IsNotEmpty, IsOptional, Matches, MaxLength, MinLength } from "class-validator";
import { HttpExceptionFilter } from "src/exception_filters/exception_filter";
import { UserRegistrationFlow } from "src/guard/users.registration.guard";


const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
const loginRegex = /^[a-zA-Z0-9_-]*$/
export class AuthForm {
    @MinLength(3)
    @MaxLength(10)
    @IsOptional()
    login: string
    @MinLength(6)
    @MaxLength(20)
    @Matches(loginRegex)
    password: string
    @IsNotEmpty()
    @IsOptional()
    @Matches(emailRegex)
    email: string
    loginOrEmail: string
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
        await this.authService.informationAboutAuth(req.ip, DataUser.loginOrEmail);
        const checkIP = await this.authService.counterAttemptAuth(req.ip, DataUser.loginOrEmail);
        if (checkIP) {
            const user = await this.usersService.checkCredentials(DataUser.loginOrEmail, DataUser.password);
            const foundUser = await this.usersRepository.findUserByLogin(DataUser.loginOrEmail);
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
    @UseGuards(UserRegistrationFlow)
    @UseFilters(new HttpExceptionFilter())
    //@UsePipes(new CustomValidationPipe())
    async registration(@Body() user: AuthForm,  @Request() req: {ip: string}, @Res() res ) {
        const result: UsersType | null | boolean = await this.usersService.createUser(user.password, user.login, user.email, req.ip);
        if (result == false) {
            throw new HttpException("",HttpStatus.BAD_REQUEST)

            //res.status(400).json({ errorsMessages:  [{ message: "Login or email already use", field: `${user.email}` }] });
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
    async registrationConfirmation(@Body() body: {code: string}, @Request() req: {ip: string}, @Res() res) {
        await this.authService.informationAboutConfirmed(req.ip, body.code);
        const checkInputCode = await this.authService.counterAttemptConfirm(req.ip, body.code);
        if (checkInputCode) {
            const activationResult = await this.usersService.confirmationEmail(body.code);
            if (activationResult) {
                res.status(204).send(checkInputCode)
            }
            else {
                const errorResponseForConfirmAccount = {errorsMessages: [{message: 'account already confirmed',field: "code",}]} 
                throw new HttpException(errorResponseForConfirmAccount, HttpStatus.BAD_REQUEST)
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
                throw new HttpException("Email send succefully", HttpStatus.NO_CONTENT);
            }
            else {
                const errorResponseForConfirmAccount= {errorsMessages: [{message: 'account already confirmed',field: "email",}]} 
                throw new HttpException(errorResponseForConfirmAccount, HttpStatus.BAD_REQUEST)
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
