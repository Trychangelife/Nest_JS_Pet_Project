import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { AuthDataType, ConfirmedAttemptDataType, EmailSendDataType, RefreshTokenStorageType, UsersType } from "src/types/types"
import { UsersRepository } from "src/users/users.repository"
import { uuid } from "uuidv4"



@Injectable()
export class SecurityDeviceService {

    constructor (
        @InjectModel('RefreshToken') protected refreshTokenModel: Model<RefreshTokenStorageType>
        ) {

    }
    async returnAllDevices (userId: string): Promise <object> {
    const foundAllDevice = await this.refreshTokenModel.find({ userId: userId }).lean()
    return foundAllDevice
}
}