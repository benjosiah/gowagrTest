import {Injectable, Logger} from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
    private transporter;
    private readonly logger = new Logger(EmailService.name);

    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: this.configService.get<string>('EMAIL_HOST'),
            port: this.configService.get<number>('EMAIL_PORT'),
            auth: {
                user: this.configService.get<string>('EMAIL_USERNAME'),
                pass: this.configService.get<string>('EMAIL_PASSWORD'),
            },
        });
    }

    async sendOTP(email: string, otp: string) {
        const mailOptions = {
            from: this.configService.get<string>('EMAIL_FROM'),
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is: ${otp}`,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            this.logger.log(`OTP sent to ${email}`);
        } catch (error) {
            this.logger.error(`Failed to send OTP to ${email}: ${error.message}`);
            throw new Error('Failed to send OTP. Please try again later.');
        }
    }
}
