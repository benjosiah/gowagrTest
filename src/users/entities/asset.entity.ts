import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from './users.entity';
import { Transaction } from '../../transaction/entity/transaction.entity';
import { Ledger } from '../../transaction/entity/ledger.entity';

export enum AssetType {
    DOLLAR = 'dollar',
    POUNDS = 'pounds',
    EURO = 'euro',
    NAIRA = 'naira',
}

@Entity()
export class Asset {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({
        type: 'enum',
        enum: AssetType,
        default: AssetType.NAIRA,
    })
    type: AssetType;


    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    balance: number;

    @ManyToOne(() => User, user => user.assets)
    user: User;

    @OneToMany(() => Transaction, transaction => transaction.asset)
    transactions: Transaction[];

    @OneToMany(() => Ledger, ledger => ledger.asset)
    ledgerEntries: Ledger[];
}