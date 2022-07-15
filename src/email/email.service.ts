import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { UsersType } from "src/types/types"
import { emailManager } from "./email.manager"

@Injectable()
export class EmailService {

    constructor (
        @InjectModel('Users') private usersModel: Model<UsersType>,
    ) {
        
    }

    async emailConfirmation(email: string): Promise<object | boolean> {
        const foundUser = await this.usersModel.findOne({ 'accountData.email': email })
        const statusAccount = await this.usersModel.findOne({'accountData.email': email, 'emailConfirmation.activatedStatus': false})
        if (foundUser !== null && statusAccount !== null) {
            return await emailManager.sendEmailConfirmation(foundUser)
        }
        else {
            return false
        }
    }
}