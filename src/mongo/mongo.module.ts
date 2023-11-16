import { Global, Module } from '@nestjs/common';
import { MongoHandlerService } from './mongo.service';
import { MongoModule } from 'nest-mongodb';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [MongoModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (config: ConfigService) => ({ uri: config.get("DATABASE_URL"), dbName: config.get("DATABASE_NAME") }),
    inject: [ConfigService]
  })],
  providers: [MongoHandlerService],
  exports: [MongoHandlerService]
})
export class MongoHandlerModule {}
