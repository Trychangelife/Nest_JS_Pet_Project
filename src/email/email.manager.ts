import { Injectable } from "@nestjs/common"
import { UsersType } from "src/types/types"
import { EmailAdapter } from "./email.adapter"
import * as SendGrid from '@sendgrid/mail';

@Injectable()
export class EmailManager  {
    constructor (private emailAdapter: EmailAdapter) {}

    async sendEmailConfirmation (user: UsersType): Promise<object> {
        const url = "https://2371-188-58-2-15.ngrok-free.app/registration-confirmation"
        //const message1 = `Please click this link to confirm you email: <a href="${url}?code=${user.emailConfirmation.codeForActivated}">${url}?code=${user.emailConfirmation.codeForActivated}</a>`
        const message = `<h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
            <a href='${url}?code=${user.emailConfirmation.codeForActivated}'>complete registration</a>
        </p>`
        return this.emailAdapter.sendEmailConfirmation(user.email, message, 'Email Confirmation after registration')
    }
    async sendEmailRecoveryPassword (user: UsersType): Promise<object> {
        const url = "https://2371-188-58-2-15.ngrok-free.app/registration-confirmation"
        //const message1 = `Please click this link to confirm you email: <a href="${url}?code=${user.emailConfirmation.codeForActivated}">${url}?code=${user.emailConfirmation.codeForActivated}</a>`
        const message = `<h1>Password recovery</h1>
        <p>To finish password recovery please follow the link below:
            <a href='${url}?recoveryCode=${user.recoveryPasswordInformation.codeForRecovery}'>complete registration</a>
        </p>`
        return this.emailAdapter.sendEmailConfirmation(user.email, message, 'Password recovery')
    }
}