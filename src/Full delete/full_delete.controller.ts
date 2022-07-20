import { Controller, Delete, HttpCode, HttpException, HttpStatus } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AuthDataType, BloggersType, CommentsType, ConfirmedAttemptDataType, EmailSendDataType, PostsType, RefreshTokenStorageType, RegistrationDataType, UsersType } from "src/types/types";

@Controller('testing')
export class FullData {

    constructor (
        @InjectModel('Posts') private postsModel: Model<PostsType>, 
        @InjectModel('Blogger') private bloggerModel: Model<BloggersType>, 
        @InjectModel('Comments') private commentsModel: Model<CommentsType>,
        @InjectModel('Users') private usersModel: Model<UsersType>,
        @InjectModel('RegistrationData') private registrationDataModel: Model<RegistrationDataType>,
        @InjectModel('AuthData') private authDataModel: Model<AuthDataType>,
        @InjectModel('CodeConfirm') private codeConfirmModel: Model<ConfirmedAttemptDataType>,
        @InjectModel('EmailSend') private emailSendModel: Model<EmailSendDataType>,
        @InjectModel('RefreshToken') private refreshTokenModel: Model<RefreshTokenStorageType>
    ) {

    }
    @Delete('all-data')
    async deleteAllData () {
        await this.postsModel.deleteMany({})
        await this.bloggerModel.deleteMany({})
        await this.usersModel.deleteMany({})
        await this.commentsModel.deleteMany({})
        await this.registrationDataModel.deleteMany({})
        await this.authDataModel.deleteMany({})
        await this.codeConfirmModel.deleteMany({})
        await this.emailSendModel.deleteMany({})
        await this.refreshTokenModel.deleteMany({})
        throw new HttpException("Data base is clear", HttpStatus.ACCEPTED)
        }
}