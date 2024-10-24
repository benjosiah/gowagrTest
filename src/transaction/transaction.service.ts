import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {User} from "../users/entities/users.entity";
import {Asset} from "../users/entities/asset.entity";
import {Ledger} from "./entity/ledger.entity";
import {GetWalletTransactionsDto, Transactions, TransactionsResponse, TransferDto} from "./transaction.model";
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
        let receiverAsset = await this.assetRepository.findOne({ where: { user: {username: transferDto.toUser}, type: transferDto.type } });

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


        await this.transactionRepository.save([debitTransaction, creditTransaction]);


        // Update wallet balances
        senderWallet.balance -= transferDto.amount;
        receiverAsset.balance += transferDto.amount;
        await this.assetRepository.save([senderWallet, receiverAsset]);

        const recieverCacheKey = `user_balance:${receiver.id}`;
        const senderCacheKey = `user_balance:${authUser.id}`;
        // await this.cacheService.del(recieverCacheKey);
        // await this.cacheService.del(senderCacheKey);
        return debitTransaction;
    }

    async getAllWalletsTransactionHistory(
        filters: GetWalletTransactionsDto,
        user: User,
        walletId?: string
    ): Promise<TransactionsResponse> {
        const queryBuilder = this.transactionRepository.createQueryBuilder('transaction')
            .leftJoinAndSelect('transaction.fromUser', 'sender')
            .leftJoinAndSelect('transaction.toUser', 'receiver')
            .leftJoinAndSelect('transaction.asset', 'asset');

        // Filters
        if (filters.type) {
            queryBuilder.andWhere('transaction.transactionType = :type', { type: filters.type });
        }

        if (filters.startDate) {
            queryBuilder.andWhere('transaction.timeCompleted >= :startDate', { startDate: filters.startDate });
        }

        if (filters.endDate) {
            queryBuilder.andWhere('transaction.timeCompleted <= :endDate', { endDate: filters.endDate });
        }

        // Add filter for specific wallet if walletId is provided
        if (walletId) {
            queryBuilder.andWhere('transaction.assetId = :walletId', { walletId });
        } else {

            const userWallets = await this.assetRepository.find({
                where: { user:{id: user.id}},
                select: ['id'],
            });

            const walletIds = userWallets.map(wallet => wallet.id);

            if (walletIds.length > 0) {
                queryBuilder.andWhere('transaction.assetId IN (:...walletIds)', { walletIds });
            }
        }

        // Sort transactions by completedAt (newest first)
        queryBuilder.orderBy('transaction.timeCompleted', 'DESC');

        const page = filters.page || 1;
        const limit = filters.limit || 10;

        const [transactions, totalCount] = await queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        const result: Transactions[] = transactions.map(transaction => {
            return {
                id: transaction.id,
                amount: transaction.amount,
                date: transaction.timeCompleted,
                type: transaction.transactionType,
                wallet: transaction.asset,
                sender: transaction.fromUser,
                recipient: transaction.toUser
            };
        });

        // return result;


        return { result, totalCount };

    }



    private generateReference() {
        const timestamp = Date.now().toString(36); // Base-36 to shorten the timestamp

        // Generate a random string for additional uniqueness
        const randomString = Math.random().toString(36).substring(2, 10);

        // Combine the timestamp and the random string to form the reference
        return `TX-${timestamp}-${randomString}`.toUpperCase();
    }
}
