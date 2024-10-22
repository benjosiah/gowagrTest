import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, OneToOne} from 'typeorm';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import {Device} from "./device.entity";
import {Otp} from "../../auth/otp.entity";
import {User} from "./users.entity";

@Entity('auth_credentials')
export class AuthCredential {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({unique: true })
    @IsEmail({}, { message: 'Email must be valid' })
    email: string;

    @Column()
    @IsNotEmpty({ message: 'Password is required' })
    @IsString()
    password: string;

    @CreateDateColumn()
    createdAt: Date;

    @OneToOne(() => User, (user) => user.credential)
    user: User;

}
