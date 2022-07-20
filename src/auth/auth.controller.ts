import { EmailService } from "src/email/email.service";
import { UsersRepository } from "src/users/users.repository";
import { UsersService } from "src/users/users.service";
import { AuthService } from "./auth.service";
import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, Put, Query, Req, Res } from "@nestjs/common";
import { UsersType } from "src/types/types";
import { Injectable, Ip, Request } from "@nestjs/common";
import { JwtService } from "src/JWT/jwt.service";

@Controller('auth')
export class AuthController {

    constructor(public usersRepository: UsersRepository, private usersService: UsersService, private authService: AuthService, public emailService: EmailService, private jwtService: JwtService) {
    }
    @Post('login')
    async authorization(@Request() req: {ip: string}, @Body() DataUser: {password: string, login: string, email: string}, @Res() res) {
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
                res.sendStatus(400);
            }
        }
        else {
            res.sendStatus(429);
        }
    }
    // async updateAccessToken() {
    //     const refreshToken = req.cookies["refreshToken"];
    //     if (!refreshToken) {
    //         res.status(401).send('Refresh token not found, where you cookie?');
    //     }
    //     else if (refreshToken) {
    //         const newAccessToken: any = await jwtService.getNewAccessToken(refreshToken);
    //         if (newAccessToken !== null) {
    //             res
    //              .cookie("refreshToken", newAccessToken.newRefreshToken, {
    //                  httpOnly: true,
    //                  secure: process.env.NODE_ENV === "production"
    //              })
    //             .status(200)
    //             .send({accessToken: newAccessToken.newAccessToken});
    //         }
    //         else {
    //             res.status(401).send('Refresh Token already not valid, repeat authorization');
    //         }
    //     } 
    //     else {
    //         res.sendStatus(400);
    //     }
    // }
    @Post('registration')
    async registration(@Body() user: {password: string, login: string, email: string},  @Request() req: {ip: string} ) {
        const result: UsersType | null | boolean = await this.usersService.createUser(user.password, user.login, user.email, req.ip);
        if (result == false) {
            throw new HttpException("Login or email already use", HttpStatus.BAD_REQUEST)
        }
        else if (result == null) {
            throw new HttpException("To many requests", HttpStatus.TOO_MANY_REQUESTS)
        }
        else {
            return result
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
    // async registrationEmailResending() {
    //     await this.authService.informationAboutEmailSend(req.ip, req.body.email);
    //     const checkAttemptEmail = await this.authService.counterAttemptEmail(req.ip, req.body.email);
    //     if (checkAttemptEmail) {
    //         await this.authService.refreshActivationCode(req.body.email);
    //         const emailResending = await this.emailService.emailConfirmation(req.body.email);
    //         if (emailResending) {
    //             res.sendStatus(204);
    //         }
    //         else {
    //             res.status(400).send({ errorsMessages: [{ message: "account already activated", field: "email" }] });
    //         }
    //     }
    //     else {
    //         res.sendStatus(429);
    //     }
    // }
    // async logout() {
    //     const refreshTokenInCookie = req.cookies.refreshToken
    //     const checkRefreshToken = await jwtService.checkRefreshToken(refreshTokenInCookie)
    //     const findTokenInData = await refreshTokenModel.findOne({refreshToken: refreshTokenInCookie})
    //     if (refreshTokenInCookie && checkRefreshToken !== false && findTokenInData !== null) {
    //         await refreshTokenModel.findOneAndDelete({refreshToken: refreshTokenInCookie})
    //         return res.send(204)
    //     }
    //     else {
    //         return res.send(401)
    //     }
    // }
    // async aboutMe() {
    //     const foundUser = await this.usersRepository.findUserByLoginForMe(req.user!.login);
    //     res.status(200).send(foundUser)


    // }
    // async getRegistrationDate() {
    //     const registrationData = await this.usersRepository.getRegistrationDate();
    //     res.send(registrationData);
    // }
    // async getAuthDate() {
    //     const authData = await this.usersRepository.getAuthDate();
    //     res.send(authData);
    // }
    // async getConfirmDate() {
    //     const confrimData = await this.usersRepository.getConfirmAttemptDate();
    //     res.send(confrimData);
    // }
    // async getEmailDate() {
    //     const emailSendData = await this.usersRepository.getEmailSendDate();
    //     res.send(emailSendData);
    // }
    // async getTokenDate() {
    //     const TokenData = await this.usersRepository.getTokenDate();
    //     res.send(TokenData);
    // }
}
