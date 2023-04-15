import { Injectable } from "@nestjs/common"
import { UsersType } from "src/types/types"
import { EmailAdapter } from "./email.adapter"
import * as SendGrid from '@sendgrid/mail';

@Injectable()
export class EmailManager  {
    constructor (private emailAdapter: EmailAdapter) {}

    async sendEmailConfirmation (user: UsersType): Promise<object> {
        const url = "https://nest-js-pet-project-fawn.vercel.app/auth/registration-confirmation"
        const message = `Please click this link to confirm you email: <a href="${url}?code=${user.emailConfirmation.codeForActivated}">${url}?code=${user.emailConfirmation.codeForActivated}</a>`
        return this.emailAdapter.sendEmailConfirmation(user.email, message, 'Email Confirmation after registration')
    }
    // async sendEmailConfirmation(user: UsersType) {
    //     const url = "https://nest-js-pet-project-fawn.vercel.app/auth/registration-confirmation"
    //     const mail = {
    //         to: user.email,
    //         subject: 'Evgeniy <jenbka999@gmail.com>',
    //         from: '<send_grid_email_address>',
    //         text: `Please click this link to confirm you email: <a href="${url}?code=${user.emailConfirmation.codeForActivated}">${url}?code=${user.emailConfirmation.codeForActivated}</a>`
    //     };

    //     return await this.sendgridService.send(mail);
    // }
}