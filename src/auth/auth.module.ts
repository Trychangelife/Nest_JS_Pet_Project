import { Module } from "@nestjs/common";
import { UsersRepository } from "src/users/users.repository";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { authDataSchema, bloggerSchema, codeConfirmSchema, commentsSchema, emailSendSchema, postSchema, refreshTokenSchema, registrationDataSchema, usersSchema } from "src/db";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersService } from "src/users/users.service";
import { EmailService } from "src/email/email.service";
import { JwtServiceClass } from "src/JWT/jwt.service";
import { JwtModule, JwtService } from "@nestjs/jwt"
import { EmailManager } from "src/email/email.manager";
import { EmailAdapter } from "src/email/email.adapter";

@Module({
    imports: [MongooseModule.forFeature([
        {name: 'Users', schema: usersSchema},
        {name: 'RegistrationData', schema: registrationDataSchema}, 
        {name: 'AuthData', schema: authDataSchema},
        {name: 'CodeConfirm', schema: codeConfirmSchema},
        {name: 'EmailSend', schema: emailSendSchema},
        {name: 'RefreshToken', schema: refreshTokenSchema},]),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: {
                expiresIn: '24h'
            }
        })],
    controllers: [AuthController],
    providers: [AuthService, UsersRepository, UsersService, EmailService, JwtServiceClass, EmailManager, EmailAdapter],
    exports: [JwtServiceClass, JwtModule]
  })
  export class AuthModule {}