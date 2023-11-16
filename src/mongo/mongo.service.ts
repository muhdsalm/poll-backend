import { Injectable } from '@nestjs/common';
import * as mongo from 'mongodb';
import { InjectDb } from 'nest-mongodb';

@Injectable()
export class MongoHandlerService{


    constructor(@InjectDb() private db: mongo.Db) {}

    getUserDB() {
        return this.db.collection('users')
    }

    cleanDB() {
        this.db.collection('users').deleteMany()
    }

}
