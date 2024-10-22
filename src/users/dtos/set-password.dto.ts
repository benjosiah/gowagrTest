import { IsString, IsNotEmpty, Matches, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SetPasswordDto {
    @ApiProperty({
        description: 'The password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
        example: 'P@ssw0rd123',
    })
    @IsString()
    @IsNotEmpty()
    @Matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/, {
        message: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    })
    password: string;

    @ApiProperty({
        description: 'The password confirmation must match the password.',
        example: 'P@ssw0rd123',
    })
    @IsString()
    @IsNotEmpty()
    @ValidateIf(o => o.password !== undefined) // Only validate if password is provided
    confirmPassword: string;

    @ApiProperty({
        description: 'Name of the browser being used.',
        example: 'Chrome',
    })
    @IsNotEmpty({ message: 'Browser name is required' })
    @IsString()
    browserName: string;

    @ApiProperty({
        description: 'Name of the device being used.',
        example: 'iPhone 12',
    })
    @IsNotEmpty({ message: 'Device name is required' })
    @IsString()
    deviceName: string;
}
