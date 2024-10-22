import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {TypeOrmModule} from "@nestjs/typeorm";


@Module({
    imports: [],
    providers: [ConfigService],
    controllers: [],
})
export class EmailModule {}
