import { Injectable } from "@nestjs/common"
import * as bcrypt from "bcrypt"
import { ObjectId } from "mongodb"
import { EmailService } from "src/email/email.service"
import { RegistrationDataType, User, UsersType } from "src/types/types"
import { UsersRepository } from "./users.repository"
import { v4 as uuidv4 } from "uuid"

@Injectable()
export class UsersService {

    constructor(protected usersRepository: UsersRepository, protected emailService: EmailService){
    }
    async allUsers(pageSize: number, pageNumber: number): Promise<object> {
        let skip = 0
        if (pageNumber && pageSize) {
            skip = (pageNumber - 1) * pageSize
        }
        return await this.usersRepository.allUsers(skip, pageSize, pageNumber)
    }
    async createUser(password: string, login: string,  email: string, ip: string): Promise<UsersType | null | boolean> {

        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)
        // Построено на классе
        const newUser = new User(new ObjectId(), uuidv4(),login, email, { passwordHash, passwordSalt}, {codeForActivated: uuidv4(), activatedStatus: false})
        const registrationData: RegistrationDataType = {
            ip,
            dateRegistation: new Date(), 
            email
        }
        await this.usersRepository.informationAboutRegistration(registrationData)
        const checkScam = await this.usersRepository.ipAddressIsScam(ip)
        if (checkScam == true) {
            if (await this.usersRepository.findUserByLogin(login) !== null || await this.usersRepository.findUserByEmail(email) !== null ) {
                return false
            }
            else { 
                const createdUser = await this.usersRepository.createUser(newUser)
                this.emailService.emailConfirmation(newUser.email)
                return createdUser
            }
        } 
        return null
    }
    async deleteUser(id: string): Promise<boolean> {
        return await this.usersRepository.deleteUser(id)
    }
    async _generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        return hash
    }
    async checkCredentials(login: string, password: string,) {
        const user = await this.usersRepository.findUserByLogin(login)
        const user2 = await this.usersRepository.findUserByEmail(login)
        if (!user && !user2) return false
        const passwordHash = await this._generateHash(password, user.accountData.passwordSalt)
        if (user.accountData.passwordHash !== passwordHash) {
            return false
        }
        return true
    }
    async findUserById(id: string): Promise<UsersType | null> {
        return await this.usersRepository.findUserById(id)
    }
    async confirmationEmail(code: string): Promise<boolean> {
        let user = await this.usersRepository.findUserByConfirmationCode(code)
        if (user) {
            return await this.usersRepository.confirmationEmail(user)
        }
        else {
            return false
        }

    }
}