import nodemailer from "nodemailer"

export const emailAdapter = {
    async sendEmailConfirmation (email: string, message: string, subject: string): Promise<object> {
        let transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: "jenbka999@gmail.com",
          pass: process.env.PASSWORD_GMAIL
        },
      })
        let mail = await transport.sendMail({
        from: 'Evgeniy <jenbka999@gmail.com>',
        to: email,
        subject: subject,
        html: message
    })
     return mail
    }
}