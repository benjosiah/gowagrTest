import {Body, Controller, Get, Post, Query, Request, UseGuards, UsePipes, ValidationPipe} from '@nestjs/common';
import {GetWalletTransactionsDto, TransferDto} from "./transaction.model";
import {User} from "../users/entities/users.entity";
import {TransactionService} from "./transaction.service";
import {ApiBearerAuth, ApiOperation, ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";

@ApiTags('transactions')
@Controller('transactions')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Initiate a Transfer' })
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    async initiateTransfer(@Body() transferDto: TransferDto, @Request() req) {
        const authUser: User = req.user;
        const transfer = await this.transactionService.initiateTransfer(transferDto, authUser);
        return { message: 'Transfer successful', transactionId: transfer.id };
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Get user wallet transaction' })
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    @Get('history')
    async getAllWalletsTransactionHistory(@Query() filters: GetWalletTransactionsDto) {
        return this.transactionService.getAllWalletsTransactionHistory(filters);
    }

    // @Get('history/:walletId')
    // async getWalletTransactionHistory(@Param('walletId') walletId: string, @Query() filters: GetWalletTransactionsDto) {
    //     return this.ledgerService.getWalletTransactionHistory(walletId, filters);
    // }



}
