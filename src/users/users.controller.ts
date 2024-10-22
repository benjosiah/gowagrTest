import {
    Controller,
    Post,
    Body,
    BadRequestException,
    UsePipes,
    ValidationPipe,
    Param,
    Request,
    UseGuards,
    Get, NotFoundException
} from '@nestjs/common';
import { UsersService } from './users.service';
import {ApiTags, ApiOperation, ApiBearerAuth} from '@nestjs/swagger';
import {RegisterUserDto} from "./dtos/users.dto";
import { VerifyEmailDto, ResendVerifyEmailDto} from "./dtos/verify-email.dto";
import {SetPasswordDto} from "./dtos/set-password.dto";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {AuthUser} from "./user.decorator";
import {User} from "./entities/users.entity";

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    async registerUser(@Body() body: RegisterUserDto) {
        return this.usersService.registerUser(body);
    }

    @Post('verify-email')
    @ApiOperation({ summary: 'Verify user email using OTP' })
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    async verifyEmail(@Body() body: VerifyEmailDto) {
        const verifiedUser = await this.usersService.verifyEmail(body.id, body.otp, body.deviceId);
        if (!verifiedUser) {
            throw new BadRequestException('Invalid OTP or user not found');
        }
        return { message: 'Email verified successfully' };
    }

    @Post('resend-otp')
    @ApiOperation({ summary: 'Resend user otp using OTP' })
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    async resendRegisterOtp(@Body() body: ResendVerifyEmailDto) {
        await this.usersService.resendOtp(body.id)
        return { message: 'OTP resent successfully' };
    }


    @Post(':id/set-password')
    @ApiOperation({ summary: 'Set password after email verification' })
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    async setPassword(@Param('id') id: string, @Body() body: SetPasswordDto) {
        return this.usersService.createUser(body, id);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Get user details' })
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    async getUserDetails(@AuthUser() user: User, @Param('id') id: string, @Request() req) {

        const userDetails = await this.usersService.findUserWithBalanceById(id, user);
        if (!userDetails) {
            throw new NotFoundException('User not found');
        }
        return userDetails;
    }

    @UseGuards(JwtAuthGuard)
    @Get('username/:username')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Get user details by username' })
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    async getUserByUsername(@AuthUser() user: User, @Param('username') username: string) {
        const userDetails = await this.usersService.findUserByUsername(username);
        if (!userDetails) {
            throw new NotFoundException('User not found');
        }
        return userDetails;
    }
}
