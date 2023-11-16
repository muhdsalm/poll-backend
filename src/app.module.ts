import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MongoHandlerModule } from './mongo/mongo.module';
import { ConfigModule } from '@nestjs/config';
import { PollModule } from './poll/poll.module';

@Module({
  imports: [AuthModule, UserModule, MongoHandlerModule, ConfigModule.forRoot({isGlobal: true}), PollModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
