import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterUserDto {
    @IsEmail({}, { message: 'Email must be valid' })
    email: string;

    @IsNotEmpty({ message: 'First name is required' })
    @IsString()
    firstName: string;

    @IsNotEmpty({ message: 'Last name is required' })
    @IsString()
    lastName: string;

    @IsNotEmpty({ message: ' Username is required' })
    @IsString()
    username: string;
}
