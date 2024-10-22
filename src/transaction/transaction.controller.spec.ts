import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetWalletTransactionsDto, TransferDto } from './transaction.model';
import { User } from '../users/entities/users.entity';
import {AssetType} from "../users/entities/asset.entity";
import {getRepositoryToken} from "@nestjs/typeorm";
import {RegisteredUser} from "../users/entities/registered_users.entity";
import {Repository} from "typeorm";
import {Device} from "../users/entities/device.entity";
import {AuthCredential} from "../users/entities/auth-credentials.entity";
import {Asset} from  "../users/entities/asset.entity"
import {EmailService} from "../emails/emails.service";


// Mock the TransactionService
const mockTransactionService = {
  initiateTransfer: jest.fn(),
  getAllWalletsTransactionHistory: jest.fn(),
};

describe('TransactionController', () => {
  let service: TransactionService;
  let registeredUserRepository: Repository<RegisteredUser>;
  let userRepository: Repository<User>;
  let deviceRepository: Repository<Device>;
  let credentialsRepository: Repository<AuthCredential>;
  let assetRepository: Repository<Asset>;
  let emailService: EmailService;
  let transactionController: TransactionController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(RegisteredUser),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Device),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(AuthCredential),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Asset),
          useClass: Repository,
        },
        {
          provide: EmailService,
          useValue: {
            // Mock methods here if needed
          },
        },
      ],
    }).compile();


    service = module.get<TransactionService>(TransactionService);
    registeredUserRepository = module.get<Repository<RegisteredUser>>(getRepositoryToken(RegisteredUser));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    deviceRepository = module.get<Repository<Device>>(getRepositoryToken(Device));
    credentialsRepository = module.get<Repository<AuthCredential>>(getRepositoryToken(AuthCredential));
    assetRepository = module.get<Repository<Asset>>(getRepositoryToken(Asset));
    emailService = module.get<EmailService>(EmailService);
  });


    describe('initiateTransfer', () => {
      it('should initiate a transfer successfully', async () => {
        const transferDto: TransferDto = {
          amount: 100,
          toUser: 'user123',
          type: AssetType.DOLLAR
        };
        const authUser: User = {id: 'authUser123', username: 'authUser'} as User;
        const mockTransferResponse = {id: 'transaction123'};

        mockTransactionService.initiateTransfer.mockResolvedValue(mockTransferResponse);

        const result = await transactionController.initiateTransfer(transferDto, {user: authUser});

        expect(result).toEqual({message: 'Transfer successful', transactionId: 'transaction123'});
        expect(mockTransactionService.initiateTransfer).toHaveBeenCalledWith(transferDto, authUser);
      });
    });

    describe('getAllWalletsTransactionHistory', () => {
      it('should return wallet transaction history', async () => {
        const filters: GetWalletTransactionsDto = {
          type: undefined, // Populate as necessary
          startDate: undefined,
          endDate: undefined,
          walletId: 'wallet123',
          page: 1,
          limit: 10,
        };

        const mockTransactionHistoryResponse = [{id: 'txn1'}, {id: 'txn2'}];
        mockTransactionService.getAllWalletsTransactionHistory.mockResolvedValue(mockTransactionHistoryResponse);

        const result = await transactionController.getAllWalletsTransactionHistory(filters);

        expect(result).toEqual(mockTransactionHistoryResponse);
        expect(mockTransactionService.getAllWalletsTransactionHistory).toHaveBeenCalledWith(filters);
      });
    });
  });
