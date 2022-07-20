import { Injectable } from "@nestjs/common"
import { AuthDataType, ConfirmedAttemptDataType, EmailSendDataType, UsersType } from "src/types/types"
import { UsersRepository } from "src/users/users.repository"
import { uuid } from "uuidv4"



@Injectable()
export class AuthService {

    constructor (protected usersRepository: UsersRepository) {

    }

    async ipAddressIsScam (ip: string, login: string): Promise <boolean> {
        return await this.usersRepository.ipAddressIsScam(ip, login)
    }
    async refreshActivationCode (email: string): Promise <UsersType | null> {
        const refreshCode = uuid()
        return await this.usersRepository.refreshActivationCode(email, refreshCode)
    }
    async counterAttemptAuth (ip: string, login: string): Promise <boolean> {
        return await this.usersRepository.counterAttemptAuth(ip, login)
    }
    async counterAttemptConfirm (ip: string, code: string): Promise <boolean> {
        return await this.usersRepository.counterAttemptConfirm(ip, code)
    }
    async counterAttemptEmail (ip: string, email: string): Promise <boolean> {
        return await this.usersRepository.counterAttemptEmail(ip, email)
    }
    async informationAboutAuth (ip: string, login: string): Promise <boolean> {
        const authData: AuthDataType = {
            ip,
            tryAuthDate: new Date(),
            login
        }
        return await this.usersRepository.informationAboutAuth(authData)
    }
    async informationAboutConfirmed (ip: string, code: string): Promise <boolean> {
        const confirmationData: ConfirmedAttemptDataType = {
            ip,
            tryConfirmDate: new Date(),
            code
        }
        return await this.usersRepository.informationAboutConfirmed(confirmationData)
    }
    async informationAboutEmailSend (ip: string, email: string): Promise <boolean> {
        const emailSendData: EmailSendDataType = {
            ip,
            emailSendDate: new Date(),
            email
        }
        return await this.usersRepository.informationAboutEmailSend(emailSendData)
    }
}