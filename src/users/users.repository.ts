import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { sub } from "date-fns"
import { Model } from "mongoose"
import { usersModel } from "src/db"
import { AuthDataType, ConfirmedAttemptDataType, EmailSendDataType, RefreshTokenStorageType, RegistrationDataType, UsersType } from "src/types/types"

const userViewModel = {
    _id: 0,
    id: 1,
    login: 1 
}
const userViewModelForMe = {
_id: 0,
id: 1,
login: 1,
email: 1
}

const aggregate = usersModel.aggregate([
    {
        "$project": {"_id": 0, "userId": "$id", "login": 1, "email": 1}
    }
    ])
    
@Injectable()
export class UsersRepository {

    constructor (
        @InjectModel('Users') protected usersModel: Model<UsersType>,
        @InjectModel('RegistrationData') protected registrationDataModel: Model<RegistrationDataType>,
        @InjectModel('AuthData') protected authDataModel: Model<AuthDataType>,
        @InjectModel('CodeConfirm') protected codeConfirmModel: Model<ConfirmedAttemptDataType>,
        @InjectModel('EmailSend') protected emailSendModel: Model<EmailSendDataType>,
        @InjectModel('RefreshToken') protected refreshTokenModel: Model<RefreshTokenStorageType>
    ) {

    }

async allUsers(skip: number, limit: number, page?: number): Promise<object> {
    const fullData = await this.usersModel.find({}, userViewModel).skip(skip).limit(limit)
    const totalCount = await this.usersModel.count({})
    const pagesCount = Math.ceil(totalCount / limit)
    return { pagesCount: pagesCount, page: page, pageSize: limit, totalCount: totalCount, items: fullData }
}
async createUser(newUser: UsersType): Promise<UsersType | null | boolean> {
    await this.usersModel.create(newUser)
    const checkUniqueLogin = await this.usersModel.count({ login: newUser.login })
    const checkUniqueEmail = await this.usersModel.count({ email: newUser.email })
    if (checkUniqueLogin > 1 || checkUniqueEmail > 1) {
        return false
    }
    else {
        return await this.usersModel.findOne({ id: newUser.id }, userViewModel)
    }

}
async deleteUser(id: string): Promise<boolean> {
    const result = await this.usersModel.deleteOne({ id: id })
    return result.deletedCount === 1
}

// ???????????????? ?????????? ??????????????????, ?????????????????????????????? ??????????????????
async confirmationEmail(user: UsersType): Promise<boolean> {
    const activatedUser = await this.usersModel.updateOne({ id: user.id }, { $set: { "emailConfirmation.activatedStatus": true } })
    if (activatedUser.modifiedCount > 0) {
        return true
    }
    else {
        return false
    }
}
async ipAddressIsScam(ip: string, login?: string): Promise<boolean> {
    const dateResult = sub(new Date(), {
        seconds: 10 // ???????????????? ?????????????? ???? ???????????????? ???? ???????????????? ??????????????
    })
    const checkResultByIp = await this.registrationDataModel.countDocuments({ $and: [{ ip: ip }, { dateRegistation: { $gt: dateResult } }] })
    if (checkResultByIp > 5) { // ?????????????????? ???????????? ??????????????, ???????? ???????????? 5 ??????????????????????, ???? ???????????? false - ???? ???????????? ???????????? 429 ????????????
        return false
    }
    else { return true }
}

// ?????????????? ???????????????????? ?????????????????????? ?? ???????????? IP ?? Login ???? ?????????????????? 10 ????????????
async counterAttemptAuth(ip: string, login?: string): Promise<boolean> {
    const dateResult = sub(new Date(), {
        seconds: 10
    })
    const checkResultByIp = await this.authDataModel.countDocuments({ $and: [{ ip: ip }, { tryAuthDate: { $gt: dateResult } }] })
    const checkResultByLogin = await this.authDataModel.countDocuments({ $and: [{ login: login }, { tryAuthDate: { $gt: dateResult } }] })
    if (checkResultByIp > 5 || checkResultByLogin > 5) {
        return false
    }
    else { return true }
}
async counterAttemptConfirm(ip: string, code?: string): Promise<boolean> {
    const dateResult = sub(new Date(), {
        seconds: 10
    })
    const checkResultByIp = await this.codeConfirmModel.countDocuments({ $and: [{ ip: ip }, { tryConfirmDate: { $gt: dateResult } }] })
    if (checkResultByIp > 5) {
        return false
    }
    else { 
        return true 
    }
}
async counterAttemptEmail(ip: string, email?: string): Promise<boolean> {
    const dateResult = sub(new Date(), {
        seconds: 10
    })
    const checkResultByIp = await this.emailSendModel.countDocuments({ $and: [{ ip: ip }, { emailSendDate: { $gt: dateResult } }] })
    if (checkResultByIp > 5) {
        return false
    }
    else { return true }
}

// ?????????????????? ?????? ???????????? ???? ???????????????????????? ????????????????
async findUserByEmail(email: string): Promise<UsersType | null> {
    const foundUser = await this.usersModel.findOne({ email: email })
    return foundUser
}
async findUserById(id: string): Promise<UsersType | null> {
    const result = await this.usersModel.findOne({ id: id })
    return result
}
async findUserByLogin(login: string): Promise<UsersType | null> {
    const foundUser: UsersType = await this.usersModel.findOne({ login: login }).lean()
    return foundUser
}


async findUserByLoginForMe(login: string): Promise<any[]> {
    const foundUser2 = await this.usersModel.aggregate([
        {$match: {login: login}},
        {$project: {_id: 0, userId: "$id", email: 1, login: 1}}
    ])
    return foundUser2[0]
}
async findUserByConfirmationCode(code: string): Promise<UsersType | null> {
    const foundUser = await this.usersModel.findOne({ "emailConfirmation.codeForActivated": code })
    return foundUser
}
async refreshActivationCode(email: string, code: string): Promise <UsersType | null> {
    const updateCode = await this.usersModel.findOneAndUpdate({ email: email }, { $set: { "emailConfirmation.codeForActivated": code } }, { new: true })
    return updateCode
}

// ?????????????????? ?????? ???????????????? ???????????????????? ???? ?????????????????????????????? ??????-??????
async getRegistrationDate(): Promise<RegistrationDataType[]> {
    return await this.registrationDataModel.find({})
}
async getAuthDate(): Promise<AuthDataType[]> {
    return await this.authDataModel.find({})
}
async getEmailSendDate(): Promise<EmailSendDataType[]> {
    return await this.emailSendModel.find({})
}
async getConfirmAttemptDate(): Promise<ConfirmedAttemptDataType[]> {
    return await this.codeConfirmModel.find({})
}
async getTokenDate(): Promise<RefreshTokenStorageType[]> {
    return await this.refreshTokenModel.find({})
}

// ?????????????????? ?????? ???????????????????? ?????????????????????? ?????????????????????????????? ??????-??????
async informationAboutRegistration(registrationData: RegistrationDataType): Promise<boolean> {
    await this.registrationDataModel.create(registrationData)
    return true
}
async informationAboutAuth(authData: AuthDataType): Promise<boolean> {
    await this.authDataModel.create(authData)
    return true
}
async informationAboutEmailSend(emailSendData: EmailSendDataType): Promise<boolean> {
    await this.emailSendModel.create(emailSendData)
    return true
}
async informationAboutConfirmed(confirmedData: ConfirmedAttemptDataType): Promise<boolean> {
    await this.codeConfirmModel.create(confirmedData)
    return true
}
}