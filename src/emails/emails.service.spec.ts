import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './emails.service';
import { ConfigService } from '@nestjs/config'; // Adjust the import

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: ConfigService,
          useValue: {}, // Provide a mock or an actual implementation here
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
