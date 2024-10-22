import { IsEmail, IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({ description: 'User email address', example: 'user@example.com' })
    @IsEmail({}, { message: 'Email must be a valid email' })
    email: string;

    @ApiProperty({ description: 'User password', example: 'strongpassword123' })
    @IsString()
    @IsNotEmpty({ message: 'Password is required' })
    password: string;

    @ApiProperty({ description: 'Optional device identifier', required: false, example: 'device-identifier' })
    @IsOptional() // Make deviceId optional
    @IsString()
    deviceId?: string;
}

export class VerifyOtpDto {
    @ApiProperty({ description: 'User email address', example: 'user@example.com' })
    @IsEmail({}, { message: 'Email must be a valid email' })
    email: string;

    @ApiProperty({ description: 'One-Time Password for verification', example: '123456' })
    @IsString()
    @IsNotEmpty({ message: 'OTP is required' })
    otp: string;

    @ApiProperty({ description: 'Browser name from which the request is made', example: 'Chrome' })
    @IsNotEmpty({ message: 'Browser Name is required' })
    @IsString()
    browserName: string;

    @ApiProperty({ description: 'Device name from which the request is made', example: 'iPhone 12' })
    @IsNotEmpty({ message: 'Device Name is required' })
    @IsString()
    deviceName: string;
}