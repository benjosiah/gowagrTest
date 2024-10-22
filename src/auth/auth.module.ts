import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import {JwtModule, JwtService} from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../users/entities/users.entity";
import {Device} from "../users/entities/device.entity";
import {Otp} from "./otp.entity";
import {UsersService} from "../users/users.service";
import {EmailService} from "../emails/emails.service";
import {RegisteredUser} from "../users/entities/registered_users.entity";
import {AuthCredential} from "../users/entities/auth-credentials.entity";
import {Asset} from "../users/entities/asset.entity";
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
    imports: [
        TypeOrmModule.forFeature([Device, Otp, RegisteredUser, AuthCredential, User, Asset]),
        UsersModule,
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET_KEY'),
                signOptions: { expiresIn: '1h' },
            }),
            inject: [ConfigService],
        }),

    ],
    providers: [AuthService, JwtStrategy, LocalStrategy, JwtService, UsersService, EmailService, ConfigService],
    controllers: [AuthController],
})
export class AuthModule {}
