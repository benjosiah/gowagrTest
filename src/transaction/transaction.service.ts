import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {RegisteredUser} from "../users/entities/registered_users.entity";
import {Repository} from "typeorm";
import {User} from "../users/entities/users.entity";
import {Device} from "../users/entities/device.entity";
import {AuthCredential} from "../users/entities/auth-credentials.entity";
import {Asset} from "../users/entities/asset.entity";
import {EmailService} from "../emails/emails.service";
import {Ledger} from "./entity/ledger.entity";
import {TransferDto} from "./transaction.model";
import {Transaction} from "./entity/transaction.entity";

@Injectable()
export class TransactionService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Ledger)
        private readonly ledgerRepository: Repository<Ledger>,
        @InjectRepository(Transaction)
        private readonly transactionRepository: Repository<Transaction>,
        @InjectRepository(Asset)
        private readonly assetRepository: Repository<Asset>,
    ) {}

    async initiateTransfer(transferDto: TransferDto, authUser:User) {

        const senderWallet =  await this.assetRepository.findOne({ where: { user: {id: authUser.id}, type: transferDto.type } });


        if (!senderWallet) {
            throw new BadRequestException('Insufficient balance');
        }

        const receiver = await this.userRepository.findOne({ where: { username: transferDto.toUser } });
        if (!receiver) {
            throw new Error('Receiver does not exist');
        }

        if (senderWallet.balance < transferDto.amount) {
            throw new BadRequestException('Insufficient balance');
        }

        // Check if the receiver has the specified asset type
        let receiverAsset = await this.assetRepository.findOne({ where: { user: receiver, type: transferDto.type } });

        // If the asset type doesn't exist for the receiver, create it
        if (!receiverAsset) {
            const receiverAsset = this.assetRepository.create({ user: receiver, type: transferDto.type, balance: 0 });
            await this.assetRepository.save(receiverAsset);
        }

        // Create a debit transaction for the sender
        const debitTransaction = this.transactionRepository.create({
            asset: senderWallet,
            transactionType: 'debit',
            amount: transferDto.amount,
            description: transferDto.description,
            fromUser: authUser,
            toUser: receiver,
            timeInitiated: new Date(),
            timeCompleted: new Date(),
            status: "completed",
            reference: this.generateReference()

        });

        // Create a credit transaction for the receiver
        const creditTransaction = this.transactionRepository.create({
            asset: receiverAsset,
            transactionType: 'credit',
            amount: transferDto.amount,
            description: transferDto.description,
            fromUser: authUser,
            toUser: receiver,
            timeInitiated: new Date(),
            timeCompleted: new Date(),
            status: "completed",
            reference: this.generateReference()
        });

        // Save transactions
        await this.transactionRepository.save([debitTransaction, creditTransaction]);


        // Update wallet balances
        senderWallet.balance -= transferDto.amount;
        receiverAsset.balance += transferDto.amount;
        await this.assetRepository.save([senderWallet, receiverAsset]);

        return debitTransaction;
    }

    async getUserTransfers(walletId: string, page: number, limit: number, filter: string) {
        const qb = this.transactionRepository.createQueryBuilder('transaction')
            .where('transaction.walletId = :walletId', { walletId });

        // Apply filters
        if (filter) {
            qb.andWhere('transaction.type = :type', { type: filter });
        }

        return await qb
            .orderBy('transaction.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit)
            .getMany();
    }

    private generateReference() {
        const timestamp = Date.now().toString(36); // Base-36 to shorten the timestamp

        // Generate a random string for additional uniqueness
        const randomString = Math.random().toString(36).substring(2, 10);

        // Combine the timestamp and the random string to form the reference
        return `TX-${timestamp}-${randomString}`.toUpperCase();
    }
}
