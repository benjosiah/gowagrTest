// src/entities/transaction.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Asset } from '../../users/entities/asset.entity'
import {User} from "../../users/entities/users.entity";

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Asset)
    asset: Asset;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @Column()
    transactionType: 'debit' | 'credit'; // Consider using enum for better type safety

    @Column({ nullable: false })
    reference: string;

    @Column({ nullable: true })
    description: string;

    @Column()
    status: 'pending' | 'completed' | 'failed'; // Transaction status

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    timeInitiated: Date; // Time when the transaction was initiated

    @Column({ type: 'timestamp', nullable: true })
    timeCompleted: Date; // Time when the transaction was completed

    @ManyToOne(() => User, { nullable: false })
    fromUser: User; // The user who initiated the transaction

    @ManyToOne(() => User, { nullable: false })
    toUser: User; // The user who received the transaction
}
