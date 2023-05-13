import { Controller, Delete, HttpCode, HttpException, HttpStatus } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AuthDataType, BlogsType, CommentsType, ConfirmedAttemptDataType, EmailSendDataType, NewPasswordType, PostsType, RecoveryPasswordType, RefreshTokenStorageType, RegistrationDataType, UsersType } from "src/types/types";

@Controller('testing')
export class FullDataController {

    constructor (
        @InjectModel('Posts') protected postsModel: Model<PostsType>, 
        @InjectModel('Blogs') protected bloggerModel: Model<BlogsType>, 
        @InjectModel('Comments') protected commentsModel: Model<CommentsType>,
        @InjectModel('Users') protected usersModel: Model<UsersType>,
        @InjectModel('RegistrationData') protected registrationDataModel: Model<RegistrationDataType>,
        @InjectModel('AuthData') protected authDataModel: Model<AuthDataType>,
        @InjectModel('CodeConfirm') protected codeConfirmModel: Model<ConfirmedAttemptDataType>,
        @InjectModel('EmailSend') protected emailSendModel: Model<EmailSendDataType>,
        @InjectModel('RefreshToken') protected refreshTokenModel: Model<RefreshTokenStorageType>,
        @InjectModel('NewPassword') protected newPasswordModel: Model<NewPasswordType>,
        @InjectModel('RecoveryPassword') protected recoveryPasswordModel: Model<RecoveryPasswordType>
    ) {

    }
    @Delete('all-data')
    async deleteAllData () {
        await this.postsModel.deleteMany()
        await this.bloggerModel.deleteMany()
        await this.usersModel.deleteMany()
        await this.commentsModel.deleteMany()
        await this.registrationDataModel.deleteMany()
        await this.authDataModel.deleteMany()
        await this.codeConfirmModel.deleteMany()
        await this.emailSendModel.deleteMany()
        await this.refreshTokenModel.deleteMany()
        await this.newPasswordModel.deleteMany()
        await this.recoveryPasswordModel.deleteMany()
        throw new HttpException("Date is clear",HttpStatus.NO_CONTENT)
        }
}