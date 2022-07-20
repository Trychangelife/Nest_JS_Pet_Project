import { EmailSendDataType, RefreshTokenStorageType, UsersType } from "../types/Types";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import jwt from "jsonwebtoken";


@Injectable()
export class JwtService {

    constructor (@InjectModel('RefreshToken') private refreshTokenModel: Model<RefreshTokenStorageType>,) {

    }
    
    async accessToken(user: UsersType) {
        const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '10 sec' })
        return accessToken
    }
    async refreshToken(user: UsersType): Promise<string> {
        const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '20 sec' })
        const newRefreshToken: RefreshTokenStorageType = {
            userId: user.id,
            refreshToken: refreshToken
        }
        const foundExistToken = await this.refreshTokenModel.findOne({ userId: user.id })
        if (foundExistToken == null) {
            await this.refreshTokenModel.create(newRefreshToken)
            return refreshToken
        }
        else {
            await this.refreshTokenModel.updateOne({ userId: user.id }, { $set: { refreshToken: newRefreshToken.refreshToken } })
            //await refreshTokenModel.findOneAndDelete({refreshToken: refreshToken})
            return refreshToken
        }
    }
    async getUserByToken(token: string) {
        try {
            const result: any = jwt.verify(token, process.env.JWT_SECRET)
            return result.id
        } catch (error) {
            return null
        }
    }
    async getNewAccessToken(rToken: string): Promise<object | null> {
        const checkToken = await this.refreshTokenModel.findOne({ refreshToken: rToken })
        if (checkToken !== null) {
            try {
                const result: any = jwt.verify(rToken, process.env.JWT_REFRESH_SECRET)
                const newAccessToken = await this.accessToken(result)
                const newRefreshToken =  await this.refreshToken(result)
                return { newAccessToken, newRefreshToken }
            } catch (error) {
                return null
            }
        }
        else {
            return null
        }

    }
    async checkRefreshToken(refreshToken: string): Promise<boolean | object> {
        try {
            const result = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
            return {token: result}
        } catch (error) {
            return false
        }
    }
}