import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
    @ApiProperty({ description: 'User email address', example: 'user@example.com' })
    @IsEmail({}, { message: 'Email must be valid' })
    email: string;

    @ApiProperty({ description: 'User first name', example: 'John' })
    @IsNotEmpty({ message: 'First name is required' })
    @IsString()
    firstName: string;

    @ApiProperty({ description: 'User last name', example: 'Doe' })
    @IsNotEmpty({ message: 'Last name is required' })
    @IsString()
    lastName: string;

    @ApiProperty({ description: 'Username for the user', example: 'john_doe' })
    @IsNotEmpty({ message: 'Username is required' })
    @IsString()
    username: string;
}

export class WalletDto {
    @ApiProperty({ description: 'Wallet ID', example: 'wallet-uuid' })
    id: string;

    @ApiProperty({ description: 'Current balance of the wallet', example: 100 })
    balance: number;

    @ApiProperty({ description: 'Type of currency in the wallet', example: 'dollar', enum: ['dollar', 'pounds', 'euro', 'naira'] })
    type: 'dollar' | 'pounds' | 'euro' | 'naira';
}

export class UserDto {
    @ApiProperty({ description: 'Unique user identifier', example: 'user-uuid' })
    @IsUUID()
    id: string;

    @ApiProperty({ description: 'User email address', example: 'user@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'User first name', example: 'John' })
    @IsString()
    firstName: string;

    @ApiProperty({ description: 'User last name', example: 'Doe' })
    @IsString()
    lastName: string;

    @ApiProperty({ description: 'User username', example: 'john_doe' })
    @IsString()
    username: string;

    @ApiProperty({ description: 'List of user wallets', type: [WalletDto], required: false })
    wallets?: WalletDto[];
}