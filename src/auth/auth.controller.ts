import {Controller, Post, Body, Req, UseGuards, HttpCode, HttpStatus} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import {LoginDto, VerifyOtpDto} from "./auth.model";
import {ApiTags} from "@nestjs/swagger";
// import { LocalAuthGuard } from './guards/local-auth.guard';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // @UseGuards(LocalAuthGuard)
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('2fa')
    async verifyOtp(@Body() body: VerifyOtpDto) {
        return this.authService.verifyOtpAndRegisterDevice(body);
    }
}
