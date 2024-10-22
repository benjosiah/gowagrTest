import { IsUUID, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailDto {
    @ApiProperty({ description: 'Unique user identifier', example: 'user-uuid' })
    @IsUUID()
    id: string;

    @ApiProperty({ description: 'One-Time Password for verification', example: '123456' })
    @IsNotEmpty({ message: 'OTP is required' })
    @IsString()
    otp: string;

    @ApiProperty({ description: 'Optional device identifier', example: 'device-identifier' })
    @IsString()
    deviceId: string;
}

export class ResendVerifyEmailDto {
    @ApiProperty({ description: 'Unique user identifier', example: 'user-uuid' })
    @IsUUID()
    id: string;
}