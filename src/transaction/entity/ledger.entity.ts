// src/entities/ledger.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Asset } from '../../users/entities/asset.entity'
import { Transaction } from './transaction.entity';

@Entity()
export class Ledger {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Transaction)
    transaction: Transaction;

    @ManyToOne(() => Asset)
    asset: Asset;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    balanceBefore: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    balanceAfter: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
