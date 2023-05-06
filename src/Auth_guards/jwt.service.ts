
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { JwtService} from '@nestjs/jwt'
import { PayloadType, RefreshTokenStorageType, UsersType } from "src/types/types";
import { uuid } from "uuidv4";


@Injectable()
export class JwtServiceClass {


    constructor (@InjectModel('RefreshToken') protected refreshTokenModel: Model<RefreshTokenStorageType>, protected jwtService: JwtService) {
    }
    
    async accessToken(user: UsersType) {
        const accessToken = this.jwtService.sign({ id: user.id }, {secret: process.env.JWT_SECRET, expiresIn: '5m'})
        return accessToken
    }
    async refreshToken(user: UsersType, ip: string, titleDevice: string): Promise<string> {
        const checkUserAgent = await this.refreshTokenModel.findOne({userId: user.id, title: titleDevice}).lean()
        // Условия если пользователь уже авторизовался с этого устройства и нужно лишь заменить RefreshToken + Сохранить DeviceID
        if (checkUserAgent !== null ) {
            const deviceId = checkUserAgent.deviceId
            const refreshToken = this.jwtService.sign({ id: user.id, deviceId: deviceId }, {secret: process.env.JWT_REFRESH_SECRET, expiresIn: '20m'})
            //const date = new Date();
            //const fullDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`;
            if (refreshToken) {
                await this.refreshTokenModel.updateOne({ userId: user.id, title: titleDevice }, { $set: { lastActiveDate: new Date (), refreshToken: refreshToken } })
                return refreshToken
            }
            
        }
        const deviceId = uuid()
        const refreshToken = this.jwtService.sign({ id: user.id, deviceId: deviceId }, {secret: process.env.JWT_REFRESH_SECRET, expiresIn: '20m'})
        const newRefreshTokenForStorage: RefreshTokenStorageType = {
            userId: user.id,
            refreshToken: refreshToken,
            ip: ip,
            title: titleDevice,
            lastActiveDate: new Date(),
            deviceId: deviceId
        }
        await this.refreshTokenModel.create(newRefreshTokenForStorage)
        return refreshToken
        // if (checkUserAgent == null) {
        //     await this.refreshTokenModel.create(newRefreshTokenForStorage)
        //     return refreshToken
        // }
        // else {
        //     //Строка 39 отвечает за постоянное обновление токенов. Закомментил для мультидевайса
        //     //await this.refreshTokenModel.updateOne({ userId: user.id }, { $set: { refreshToken: newRefreshTokenForStorage.refreshToken } })
        //     await this.refreshTokenModel.create(newRefreshTokenForStorage)
        //     //await refreshTokenModel.findOneAndDelete({refreshToken: refreshToken})
        //     return refreshToken
        // }
    }
    async getUserByAccessToken(token: string) {
        try {
            const result: any = this.jwtService.verify(token, {secret: process.env.JWT_SECRET})
            return result.id
        } catch (error) {
            return null
        }
    }
    async getUserByRefreshToken(token: string) {
        try {
            const result: any = this.jwtService.verify(token, {secret: process.env.JWT_REFRESH_SECRET})
            return result.id
        } catch (error) {
            return null
        }
    }
    async getNewAccessToken(rToken: string, ip: string, titleDevice: string): Promise<object | null> {
        const checkToken = await this.refreshTokenModel.findOne({ refreshToken: rToken })
        if (checkToken !== null) {
            try {
                const result: any = this.jwtService.verify(rToken, {secret: process.env.JWT_REFRESH_SECRET})
                const newAccessToken = await this.accessToken(result)
                const newRefreshToken =  await this.refreshToken(result, ip, titleDevice)
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
    async getJwtPayload (refreshToken: string): Promise<PayloadType> {
        const tokenParts = refreshToken.split('.');
        const payloadString = Buffer.from(tokenParts[1], 'base64').toString('utf-8');
        const payload = JSON.parse(payloadString);
        return payload
    }
}