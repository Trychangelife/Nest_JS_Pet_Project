import { Injectable } from "@nestjs/common"
import { UsersType } from "src/types/types"
import { EmailAdapter } from "./email.adapter"
import * as SendGrid from '@sendgrid/mail';

@Injectable()
export class EmailManager  {
    constructor (private emailAdapter: EmailAdapter) {}

    async sendEmailConfirmation (user: UsersType): Promise<object> {
        const url = "https://a015-176-89-19-32.ngrok-free.app/registration-confirmation"
        const message1 = `Please click this link to confirm you email: <a href="${url}?code=${user.emailConfirmation.codeForActivated}">${url}?code=${user.emailConfirmation.codeForActivated}</a>`
        const message = `<h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
            <a href='${url}?code=${user.emailConfirmation.codeForActivated}'>complete registration</a>
        </p>`
        return this.emailAdapter.sendEmailConfirmation(user.email, message, 'Email Confirmation after registration')
    }
}