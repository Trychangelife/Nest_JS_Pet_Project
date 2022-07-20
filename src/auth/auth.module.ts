import { Module } from "@nestjs/common";
import { UsersRepository } from "src/users/users.repository";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { authDataSchema, bloggerSchema, codeConfirmSchema, commentsSchema, emailSendSchema, postSchema, refreshTokenSchema, registrationDataSchema, usersSchema } from "src/db";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersService } from "src/users/users.service";
import { EmailService } from "src/email/email.service";
import { JwtService } from "src/JWT/jwt.service";

@Module({
    imports: [MongooseModule.forFeature([
        {name: 'Users', schema: usersSchema},
        {name: 'RegistrationData', schema: registrationDataSchema}, 
        {name: 'AuthData', schema: authDataSchema},
        {name: 'CodeConfirm', schema: codeConfirmSchema},
        {name: 'EmailSend', schema: emailSendSchema},
        {name: 'RefreshToken', schema: refreshTokenSchema},])],
    controllers: [AuthController],
    providers: [AuthService, UsersRepository, UsersService, EmailService, JwtService],
  })
  export class AuthModule {}