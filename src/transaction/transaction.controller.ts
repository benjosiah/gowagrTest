import {Body, Controller, Get, Post, Query, Request, UseGuards, UsePipes, ValidationPipe} from '@nestjs/common';
import {TransferDto} from "./transaction.model";
import {User} from "../users/entities/users.entity";
import {TransactionService} from "./transaction.service";
import {ApiBearerAuth, ApiOperation, ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";

@ApiTags('transactions')
@Controller('transactions')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) {}

    @UseGuards(JwtAuthGuard)
    @Post('transfers')
    @Get(':id')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Initiate a Transfer' })
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    async initiateTransfer(@Body() transferDto: TransferDto, @Request() req) {
        const authUser: User = req.user;
        const transfer = await this.transactionService.initiateTransfer(transferDto, authUser);
        return { message: 'Transfer successful', transactionId: transfer.id };
    }

    @UseGuards(JwtAuthGuard)
    @Get('transfers')
    @Get(':id')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Get user wallet transaction' })
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    async listUserTransfers(
        @Query('walletId') walletId: string,
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('filter') filter: string,
    ) {
        return await this.transactionService.getUserTransfers(walletId, page, limit, filter);
    }


}
