import { Injectable } from "@nestjs/common"
import { UsersType } from "src/types/types"
import { EmailAdapter } from "./email.adapter"

@Injectable()
export class EmailManager  {
    constructor (private emailAdapter: EmailAdapter) {}

    async sendEmailConfirmation (user: UsersType): Promise<object> {
        const url = "https://bloggers-post-api.herokuapp.com/auth/registration-confirmation"
        const message = `Please click this link to confirm you email: <a href="${url}?code=${user.emailConfirmation.codeForActivated}">${url}?code=${user.emailConfirmation.codeForActivated}</a>`
        return this.emailAdapter.sendEmailConfirmation(user.email, message, 'Email Confirmation after registration')
    }
}