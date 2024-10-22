import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany} from 'typeorm';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({unique: true })
    @IsEmail({}, { message: 'Email must be valid' })
    email: string;

    @Column()
    @IsNotEmpty({ message: 'First name is required' })
    @IsString()
    firstName: string;

    @Column()
    @IsNotEmpty({ message: 'Last name is required' })
    @IsString()
    lastName: string;

    @Column()
    @IsNotEmpty({ message: 'Username is required' })
    @IsString()
    username: string;

    @Column()
    @IsNotEmpty({ message: 'Password is required' })
    @IsString()
    password: string;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => Device, device => device.user) // Relation with Device
    devices: Device[];
}
