import { UsersType } from "src/types/types"
import { emailAdapter } from "./email.adapter"

export const emailManager = {
    async sendEmailConfirmation (user: UsersType): Promise<object> {
        const url = "https://bloggers-post-api.herokuapp.com/auth/registration-confirmation"
        const message = `Please click this link to confirm you email: <a href="${url}?code=${user.emailConfirmation.codeForActivated}">${url}?code=${user.emailConfirmation.codeForActivated}</a>`
        return emailAdapter.sendEmailConfirmation(user.email, message, 'Email Confirmation after registration')
    }
}