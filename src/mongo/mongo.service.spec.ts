import { Test, TestingModule } from '@nestjs/testing';
import { MongoHandlerService } from './mongo.service';

describe('MongoService', () => {
  let service: MongoHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MongoHandlerService],
    }).compile();

    service = module.get<MongoHandlerService>(MongoHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
