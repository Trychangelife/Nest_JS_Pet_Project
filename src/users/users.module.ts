import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BloggersModule } from "src/bloggers/bloggers.module";
import { authDataSchema, bloggerSchema, codeConfirmSchema, commentsSchema, emailSendSchema, postSchema, refreshTokenSchema, registrationDataSchema, usersSchema } from "src/db";
import { EmailService } from "src/email/email.service";
import { UsersController } from "./users.controller";
import { UsersRepository } from "./users.repository";
import { UsersService } from "./users.service";




@Module({
    imports: [BloggersModule, MongooseModule.forFeature([
    {name: 'Users', schema: usersSchema},
    {name: 'RegistrationData', schema: registrationDataSchema}, 
    {name: 'AuthData', schema: authDataSchema},
    {name: 'CodeConfirm', schema: codeConfirmSchema},
    {name: 'EmailSend', schema: emailSendSchema},
    {name: 'RefreshToken', schema: refreshTokenSchema},])],
    controllers: [UsersController],
    providers: [UsersService, UsersRepository, EmailService],
  })
  export class UsersModule {}