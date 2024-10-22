import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "2806a3d9dd431c",
                pass: "7f12afa0b888cb"
            }
        });
    }

    async sendOTP(email: string, otp: string) {
        const mailOptions = {
            from: 'your-email@example.com',
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is: ${otp}`,
        };

        await this.transporter.sendMail(mailOptions);
    }
}
