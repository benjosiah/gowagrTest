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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '',
      database: 'gowagr',
      entities: [RegisteredUser, User, Device, Otp, AuthCredential, Asset, Transaction, Ledger],
      synchronize: true,
    }),
      UsersModule,
      AuthModule,
      TransactionModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
