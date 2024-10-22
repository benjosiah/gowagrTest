import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import {IsEmail, IsNotEmpty, IsString} from "class-validator";

@Entity('registered_users')
export class RegisteredUser {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({unique: true })
    @IsEmail({}, { message: 'Email must be valid' })
    email: string;

    @Column()
    @IsNotEmpty({ message: 'Username is required' })
    @IsString()
    username: string;

    @Column()
    @IsNotEmpty({ message: 'First name is required' })
    @IsString()
    firstName: string;

    @Column()
    @IsNotEmpty({ message: 'Last name is required' })
    @IsString()
    lastName: string;

    @Column()
    @IsNotEmpty({ message: 'Last name is required' })
    @IsString()
    otp: string;

    @Column({ default: false })
    isEmailVerified: boolean;


    @Column({nullable:true})
    deviceId: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    otpCreatedAt: Date;
}
