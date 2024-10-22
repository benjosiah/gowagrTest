import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/entities/users.entity'

@Entity()
export class Otp {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    email: string;

    @Column()
    otp: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column()
    expiresAt: Date;

    @Column({ default: false })
    isVerified: boolean;

    @ManyToOne(() => User, (user) => user.otps, { onDelete: 'CASCADE' })
    user: User;
}
