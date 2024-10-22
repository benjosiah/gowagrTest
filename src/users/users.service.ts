import {BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {RegisteredUser} from "./entities/registered_users.entity"
import {User} from './entities/users.entity';
import {RegisterUserDto, UserDto} from "./dtos/users.dto";
import {EmailService} from "../emails/emails.service";
import {randomInt} from 'crypto';
import {v4 as uuidv4} from 'uuid';
import * as bcrypt from 'bcrypt';
import {Device} from "./entities/device.entity";
import {SetPasswordDto} from "./dtos/set-password.dto";
import {AuthCredential} from "./entities/auth-credentials.entity";
import {Asset} from "./entities/asset.entity";


@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(RegisteredUser)
        private readonly registeredUserRepository: Repository<RegisteredUser>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Device)
        private readonly deviceRepository: Repository<Device>,
        @InjectRepository(AuthCredential)
        private readonly credentialsRepository: Repository<AuthCredential>,
        @InjectRepository(Asset)
        private readonly assetRepository: Repository<Asset>,
        private emailService: EmailService,
    ) {}

    async registerUser(registerUserDto: RegisterUserDto) {

        const existingUser = await this.registeredUserRepository.findOne({
            where: { email: registerUserDto.email },
        });

        if (existingUser) {
            throw new ConflictException('Email already exists');
        }
        const otp = String(randomInt(100000, 999999));
        this.emailService.sendOTP(registerUserDto.email, otp);

        const registeredUser = this.registeredUserRepository.create(
            {
                ...registerUserDto,
                otp,
                deviceId: uuidv4(),
                otpCreatedAt: new Date(),
            });
        await this.registeredUserRepository.save(registeredUser);

        return {
            id: registeredUser.id,
            username: registeredUser.username,
            email: registeredUser.email,
            firstName: registeredUser.firstName,
            lastName: registeredUser.lastName,
        };
    }

    async verifyEmail(id: string, otp: string, deviceId: string) {
        const registeredUser = await this.registeredUserRepository.findOneBy({ id });

        if (!registeredUser) {
            throw new BadRequestException('User not found');
        }

        const isOtpExpired = (new Date().getTime() - registeredUser.otpCreatedAt.getTime()) > 5 * 60000;
        if (isOtpExpired) {
            throw new BadRequestException('OTP has expired');
        }

        if (registeredUser.otp !== otp || registeredUser.deviceId !== deviceId) {
            throw new BadRequestException('Invalid OTP or device ID');
        }


        registeredUser.isEmailVerified = true;
        await this.registeredUserRepository.save(registeredUser);
        return registeredUser;

    }

    async resendOtp(id:string){
        const user = await this.registeredUserRepository.findOneBy({id})
        if (!user) {
            throw new ConflictException('User not found');
        }

        // Generate a new OTP
        const otp = String(randomInt(100000, 999999));
        this.emailService.sendOTP(user.email, otp);

        // Update the user's OTP in the database
        user.otp = otp;
        user.otpCreatedAt = new Date()
        await this.registeredUserRepository.save(user);
    }

    async createUser(createUserDTO: SetPasswordDto, id: string) {
        const registeredUser = await this.registeredUserRepository.findOneBy({id})
        const user = this.userRepository.create({
            email: registeredUser.email,
            username: registeredUser.username,
            firstName: registeredUser.firstName,
            lastName: registeredUser.lastName,
        });

        await this.userRepository.save(user);

        const credentials = this.credentialsRepository.create({
            email: registeredUser.email,
            password: await bcrypt.hash(createUserDTO.password, 10),
            user: user
        });

        await this.credentialsRepository.save(credentials);

        const device = this.deviceRepository.create({
            deviceId: registeredUser.deviceId,
            browserName: createUserDTO.browserName,
            deviceName: createUserDTO.deviceName,
            lastActive: new Date(),
            user: user,
        });

        await this.deviceRepository.save(device);

        const wallet = this.assetRepository.create({
            balance: 100.00,
            user: user,
        });

        await this.assetRepository.save(wallet);


        return user;
    }


    async findUserByUsername(username: string): Promise<UserDto> {
        const user = await this.userRepository.findOne({where: {username}});
        if (!user) {
            throw new NotFoundException('User not found');
        }

        return {
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
        };
    }

    async findUserWithBalanceById(id: string, authUser: User): Promise<UserDto> {
        // const cacheKey = `user_balance:${id}`;
        // const cachedBalance = await this.cacheService.get<UserDto>(cacheKey);
        //
        // if (cachedBalance) {
        //     return cachedBalance; // Return cached balance if available
        // }

        if (id !== authUser.id) {
            throw new ForbiddenException('You do not have permission to access this user\'s information');
        }

        const user = await  this.userRepository.findOne({where: {id}, relations: ['assets']});
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const userDto: UserDto = {
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            wallets: user.assets.map(wallet => ({
                id: wallet.id,
                balance: wallet.balance,
                type: wallet.type,
            })),
        };

        // Cache the balance with a TTL of 1 hour
        // await this.cacheService.set(cacheKey, userDto, 3600);
        return userDto;
    }
}
