import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {RegisteredUser} from "./users/entities/registered_users.entity";
import {User} from "./users/entities/users.entity";
import { EmailService } from './emails/emails.service';
import {Device} from "./users/entities/device.entity";
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import {Otp} from "./auth/otp.entity";
import {AuthCredential} from "./users/entities/auth-credentials.entity";
import { TransactionModule } from './transaction/transaction.module';
import {Asset} from "./users/entities/asset.entity";
import {Ledger} from "./transaction/entity/ledger.entity";
import {Transaction} from "./transaction/entity/transaction.entity";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {RedisModule} from "@nestjs-modules/ioredis";
import {EmailModule} from "./emails/email.module";
const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: +configService.get<number>('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
          autoLoadEntities: true,
          synchronize: true,
          entities: [RegisteredUser, User, Device, Otp, AuthCredential, Asset, Transaction, Ledger],
        };
      },
      inject: [ConfigService],
    }),
    EmailModule,
    UsersModule,
    AuthModule,
    TransactionModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
