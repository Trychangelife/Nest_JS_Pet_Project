import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { RefreshTokenStorageType } from "src/types/types"
import { SecurityDeviceRepository } from "./security.repository"



@Injectable()
export class SecurityDeviceService {

    constructor (
        @InjectModel('RefreshToken') protected refreshTokenModel: Model<RefreshTokenStorageType>,
        public securityDeviceRepository: SecurityDeviceRepository
        ) {

    }
    async returnAllDevices (userId: string): Promise <object> {
    const foundAllDevice = await this.securityDeviceRepository.returnAllDevices(userId)
    return foundAllDevice
}
}