import {IsUUID, IsString, IsNotEmpty, Matches, ValidateIf} from 'class-validator';

export class SetPasswordDto {
    @IsString()
    @IsNotEmpty()
    @Matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/, {
        message: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    })
    password: string;

    @IsString()
    @IsNotEmpty()
    @ValidateIf(o => o.password !== undefined) // Only validate if password is provided
    confirmPassword: string;

    @IsNotEmpty({ message: ' Username is required' })
    @IsString()
    browserName: string;

    @IsNotEmpty({ message: ' Username is required' })
    @IsString()
    deviceName: string;
}
