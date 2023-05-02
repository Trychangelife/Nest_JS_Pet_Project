import { Injectable, Next } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { BlogsType, CommentsType, PostsType, RefreshTokenStorageType, UsersType } from "src/types/types"

export const deviceView = {
    _id: 0,
    ip: 1,
    title: 1,
    lastActiveDate: 1,
    deviceId: 1
}

@Injectable()
export class SecurityDeviceRepository {

    constructor (
    @InjectModel('RefreshToken') protected refreshTokenModel: Model<RefreshTokenStorageType>
    ) {   }
    async returnAllDevices (userId: string): Promise <object> {
        const foundAllDevice = await this.refreshTokenModel.find({ userId: userId }, deviceView).lean()
        return foundAllDevice
    }
    async terminateAllSession (userId: string): Promise <object> {
        return 
    }
    async terminateTargetSessionById (userId: string): Promise <object> {
        return 
    }
}