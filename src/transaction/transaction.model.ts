// transaction.dto.ts
import { IsNotEmpty, IsNumber, IsString, IsEnum, IsOptional } from 'class-validator';
import { AssetType } from "../users/entities/asset.entity";
import { ApiProperty } from '@nestjs/swagger';

export class TransactionDto {
    @ApiProperty({ description: 'Transaction ID', example: 'txn_123456789' })
    @IsNotEmpty()
    id: string;

    @ApiProperty({ description: 'Amount of the transaction', example: 100 })
    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @ApiProperty({ description: 'Reference for the transaction', example: 'reference-1234' })
    @IsNotEmpty()
    @IsString()
    reference: string;

    @ApiProperty({ description: 'Current status of the transaction', example: 'completed', enum: ['pending', 'completed', 'failed'] })
    @IsNotEmpty()
    @IsEnum(['pending', 'completed', 'failed'])
    status: 'pending' | 'completed' | 'failed';

    @ApiProperty({ description: 'Type of the transaction', example: 'debit', enum: ['debit', 'credit'] })
    @IsNotEmpty()
    @IsString()
    transactionType: 'debit' | 'credit';

    @ApiProperty({ description: 'Username or ID of the sender', example: 'john_doe' })
    @IsNotEmpty()
    @IsString()
    fromUser: string; // User ID or username of the sender

    @ApiProperty({ description: 'Username or ID of the recipient', example: 'jane_doe' })
    @IsNotEmpty()
    @IsString()
    toUser: string; // User ID or username of the recipient

    @ApiProperty({ description: 'Time the transaction was initiated', required: false })
    @IsOptional()
    timeInitiated?: Date;

    @ApiProperty({ description: 'Time the transaction was completed', required: false })
    @IsOptional()
    timeCompleted?: Date;

    @ApiProperty({ description: 'Optional description of the transaction', required: false })
    @IsOptional()
    description?: string; // Optional description
}

export class TransferDto {
    @ApiProperty({ description: 'Amount to transfer', example: 50 })
    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @ApiProperty({ description: 'Recipient username or ID', example: 'jane_doe' })
    @IsNotEmpty()
    @IsString()
    toUser: string;

    @ApiProperty({ description: 'Optional description for the transfer', required: false })
    @IsOptional()
    description?: string;

    @ApiProperty({ description: 'Type of asset for the transfer', example: 'dollar', enum: ['dollar', 'pounds', 'euro', 'naira'] })
    @IsNotEmpty()
    @IsString()
    type: AssetType;
}

export class LedgerDto {
    @ApiProperty({ description: 'Ledger entry ID', example: 'ledger_123' })
    @IsNotEmpty()
    id: string;

    @ApiProperty({ description: 'Related transaction ID', example: 'txn_123456789' })
    @IsNotEmpty()
    @IsString()
    transactionId: string;

    @ApiProperty({ description: 'User ID associated with this ledger entry', example: 'user-uuid' })
    @IsNotEmpty()
    @IsString()
    userId: string;

    @ApiProperty({ description: 'Change in balance due to the transaction', example: 20 })
    @IsNotEmpty()
    @IsNumber()
    balanceChange: number; // Amount by which the balance changes

    @ApiProperty({ description: 'Type of balance change (debit or credit)', example: 'credit', enum: ['debit', 'credit'] })
    @IsNotEmpty()
    @IsString()
    type: 'debit' | 'credit'; // Whether the transaction is a debit or credit

    @ApiProperty({ description: 'Optional description for the ledger entry', required: false })
    @IsOptional()
    @IsString()
    description?: string; // Optional description

    @ApiProperty({ description: 'Time of the ledger entry', example: '2024-01-01T00:00:00Z' })
    @IsNotEmpty()
    time: Date; // Time of the ledger entry
}
