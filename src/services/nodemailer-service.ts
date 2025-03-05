import 'dotenv/config';
import nodemailer from 'nodemailer';

export class NodemailerService {
    user_email : string = process.env.USER_EMAIL ?? "";
    user_password : string = process.env.USER_PASSWORD ?? "";
    transporter = nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: this.user_email,
          pass: this.user_password,
        },
    });

    constructor() {}

    async SendMail(email : string, subject : string, text : string) {
        const mailOptions = {
            from: this.user_email,
            to: email,
            subject: subject,
            text: text,
          };

          this.transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
            console.error("Error sending email: ", error instanceof Error ? error.message : 
            "Something went wrong sending email");
            } else {
              console.log("Email sent: ", info.response);
            }
          });
    }
};