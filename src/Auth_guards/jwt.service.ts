
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { JwtService} from '@nestjs/jwt'
import { RefreshTokenStorageType, UsersType } from "src/types/types";


@Injectable()
export class JwtServiceClass {


    constructor (@InjectModel('RefreshToken') protected refreshTokenModel: Model<RefreshTokenStorageType>, protected jwtService: JwtService) {
    }
    
    async accessToken(user: UsersType) {
        const accessToken = this.jwtService.sign({ id: user.id }, {secret: process.env.JWT_SECRET, expiresIn: '15m'})
        return accessToken
    }
    async refreshToken(user: UsersType): Promise<string> {
        const refreshToken = this.jwtService.sign({ id: user.id }, {secret: process.env.JWT_REFRESH_SECRET, expiresIn: '1h'})
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
            const result: any = this.jwtService.verify(token, {secret: process.env.JWT_SECRET})
            return result.id
        } catch (error) {
            return null
        }
    }
    async getNewAccessToken(rToken: string): Promise<object | null> {
        const checkToken = await this.refreshTokenModel.findOne({ refreshToken: rToken })
        if (checkToken !== null) {
            try {
                const result: any = this.jwtService.verify(rToken, {secret: process.env.JWT_REFRESH_SECRET})
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
            const result = this.jwtService.verify(refreshToken, {secret: process.env.JWT_REFRESH_SECRET})
            return {token: result}
        } catch (error) {
            return false
        }
    }
}