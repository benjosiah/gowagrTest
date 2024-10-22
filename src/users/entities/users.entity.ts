import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, OneToOne, JoinColumn} from 'typeorm';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import {Device} from "./device.entity";
import {Otp} from "../../auth/otp.entity";
import {AuthCredential} from "./auth-credentials.entity";
import {Asset} from "./asset.entity";

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

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => Device, device => device.user, { cascade: true }) // Relation with Device
    devices: Device[];

    @OneToMany(() => Otp, otp => otp.user, { cascade: true }) // Relation with Device
    otps: Otp[];

    @OneToMany(() => Asset, asset => asset.user) // Relation with Device
    assets: Asset[];

    @OneToOne(() => AuthCredential, (credential) => credential.user, { cascade: true })
    @JoinColumn()
    credential: AuthCredential;
}
