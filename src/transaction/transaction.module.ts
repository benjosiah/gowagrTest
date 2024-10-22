import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {RegisteredUser} from "../users/entities/registered_users.entity";
import {User} from "../users/entities/users.entity";
import {Device} from "../users/entities/device.entity";
import {Asset} from "../users/entities/asset.entity";
import {AuthCredential} from "../users/entities/auth-credentials.entity";
import {Ledger} from "./entity/ledger.entity";
import {Transaction} from "./entity/transaction.entity";
// import {CacheService} from "../redis/redis.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Ledger, Transaction, Asset]),
  ],
  providers: [TransactionService],
  controllers: [TransactionController]
})
export class TransactionModule {}
