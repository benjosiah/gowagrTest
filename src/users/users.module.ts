import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {RegisteredUser} from "./entities/registered_users.entity";
import {User} from "./entities/users.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {EmailService} from "../emails/emails.service";
import {Device} from "./entities/device.entity";
import {Asset} from "./entities/asset.entity";
import {AuthCredential} from "./entities/auth-credentials.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([RegisteredUser, User, Device, Asset, AuthCredential]),
  ],

  controllers: [UsersController],
  providers: [UsersService, EmailService]
})
export class UsersModule {}
