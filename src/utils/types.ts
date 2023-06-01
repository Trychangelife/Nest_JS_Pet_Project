import { Schema} from "@nestjs/mongoose";
import { ObjectId } from "mongodb"; 




export enum LIKES {
    LIKE = "Like",
    DISLIKE = "Dislike",
    NONE = "None"
}

export type NewestLikes = {
    addedAt: Date,
    userId: string,
    login: string
}

export type extendedLikesInfo = {
    likesCount: number,
    dislikesCount: number,
    myStatus: LIKES,
    newestLikes: NewestLikes
}

export class CreateUser {
    email: string
    login: string
    id: string
    password: string
    createdAt: string

}
export class User { 
    constructor(
        public _id: ObjectId, 
        public id: string, 
        public login: string,
        public email: string,
        public createdAt: string,
        public accountData: { passwordHash: string, passwordSalt: string},
        public emailConfirmation: {codeForActivated: string, activatedStatus: boolean},
        public recoveryPasswordInformation?: {codeForRecovery: string, createdDateRecoveryCode: string}) {}
}

export class DeviceAuthData {
    constructor (
    public userId: string,
    public refreshToken: string,
    public ip: string,
    public title: string,
    public deviceId: string,
    public lastActiveDate: string
    ) {}
}

export type UsersType = {
    _id: ObjectId;
    id: string;
    login: string;
    email: string;
    createdAt: string;
    accountData: {
        passwordHash: string;
        passwordSalt: string;
    }
    emailConfirmation: {
        codeForActivated: string
        activatedStatus: boolean
    }
    recoveryPasswordInformation?: {
        codeForRecovery: string
        createdDateRecoveryCode: string
    }
};


export type RegistrationDataType = {
    ip: string
    dateRegistation: Date
    email: string
}
export type AuthDataType = {
    ip: string
    tryAuthDate: Date
    login: string
}
export type EmailSendDataType = {
    ip: string
    emailSendDate: Date
    email: string
}
export type ConfirmedAttemptDataType = {
    ip: string
    tryConfirmDate: Date
    code: string
}
export type RefreshTokenStorageType = {
    userId: string
    refreshToken: string
    ip: string
    title: string
    deviceId: string
    lastActiveDate: Date
}
export type PayloadType = {
    id: string
    deviceId: string
}
export type RecoveryPasswordType = {
    ip: string
    emailSendDate: Date
    email: string
}
export type NewPasswordType = {
    ip: string
    recoveryCode: string
    timestampNewPassword: Date
}
