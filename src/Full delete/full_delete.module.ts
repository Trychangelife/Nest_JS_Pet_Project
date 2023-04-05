import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { authDataSchema, bloggerSchema, codeConfirmSchema, commentsSchema, emailSendSchema, postSchema, refreshTokenSchema, registrationDataSchema, usersSchema } from "src/db";
import { PostRepository } from "src/posts/posts.repository";
import { PostsService } from "src/posts/posts.service";
import { FullDataController } from "./full_delete.controller";




@Module({
    imports: [MongooseModule.forFeature([
        {name: 'Blogger', schema: bloggerSchema}, 
        {name: 'Posts', schema: postSchema}, 
        {name: 'Comments', schema: commentsSchema},
        {name: 'Users', schema: usersSchema},
        {name: 'RegistrationData', schema: registrationDataSchema},
        {name: 'AuthData', schema: authDataSchema},
        {name: 'CodeConfirm', schema: codeConfirmSchema},
        {name: 'EmailSend', schema: emailSendSchema},
        {name: 'RefreshToken', schema: refreshTokenSchema},
    ])],
    controllers: [FullDataController],
    providers: [],
  })
  export class FullDeleteModule {}