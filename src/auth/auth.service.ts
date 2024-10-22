import {Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service'; // Import UsersService
import * as bcrypt from 'bcrypt';
import {InjectRepository} from "@nestjs/typeorm";
import {Otp} from "./otp.entity";
import {Repository} from "typeorm";
import {User} from "../users/entities/users.entity";
import { randomInt } from 'crypto';
import {EmailService} from "../emails/emails.service";
import {Device} from "../users/entities/device.entity";
import {LoginDto, VerifyOtpDto} from "./auth.model";
import {v4 as uuidv4} from "uuid";
import {AuthCredential} from "../users/entities/auth-credentials.entity";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Device)
        private readonly deviceRepository: Repository<Device>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Otp)
        private readonly otpRepository: Repository<Otp>,
        @InjectRepository(AuthCredential)
        private readonly credentialsRepository: Repository<AuthCredential>,
        private readonly jwtService: JwtService,
        private emailService: EmailService,
        private readonly configService: ConfigService,
    ) {}

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.credentialsRepository.findOne({ where: { email }, relations:['user'] });
        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(loginDto: LoginDto) {

        const credential = await this.validateUser(loginDto.email, loginDto.password);
        if (!credential) {

            throw new UnauthorizedException('Invalid email or password');
        }



        const existingDevice = await this.deviceRepository.findOne({
            where: { user:{ id: credential.user.id }, deviceId: loginDto.deviceId }, relations: ['user'],
        });

        console.log(existingDevice)

        if (!existingDevice) {
            await this.SendOtp(credential.user);

            return {
                email: credential.email,
                accessToken: null
            }
        } else {

            existingDevice.lastActive = new Date();
            await this.deviceRepository.save(existingDevice);
            const accessToken = await this.generateJwt(credential.user);
            return {
                id: credential.user.id,
                email: credential.email,
                accessToken
            };
        }
    }

    async SendOtp(user: User) {
        const otp = String(randomInt(100000, 999999));
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes

        // Save the OTP in the database
        const otpRecord = this.otpRepository.create({
            email: user.email,
            otp,
            expiresAt,
            isVerified: false,
            user: user
        });
        await this.otpRepository.save(otpRecord);

        this.emailService.sendOTP(user.email, otp);
    }

    async verifyOtpAndRegisterDevice(verifyOtpDto: VerifyOtpDto) {
        const otpRecord = await this.otpRepository.findOne({ where: { email: verifyOtpDto.email, otp: verifyOtpDto.otp } });

        if (!otpRecord) {
            throw new UnauthorizedException('Invalid or expired OTP');
        }

        // Check if the OTP is expired
        const currentTime = new Date();
        if (currentTime > otpRecord.expiresAt) {
            await this.otpRepository.delete(otpRecord.id); // Clean up expired OTP
            throw new UnauthorizedException('OTP expired');
        }

        const user = await this.userRepository.findOne({ where: { email: verifyOtpDto.email } });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Register new device

        const newDevice = this.deviceRepository.create({
            deviceId: uuidv4(),
            browserName:  verifyOtpDto.browserName, // You can get this from the request or client
            deviceName: verifyOtpDto.deviceName, // You can get this from the request or client
            lastActive: new Date(),
            user: user,
        });
        await this.deviceRepository.save(newDevice);


        // Generate JWT token for the user
        const accessToken = await this.generateJwt(user);

        // Clean up OTP record after use
        await this.otpRepository.delete(otpRecord.id);

        return accessToken;
    }

    async generateJwt(user: User): Promise<string> {
        const payload = { sub: user.id, email: user.email };
        return this.jwtService.sign(payload, { secret: "secret"});
    }
}
