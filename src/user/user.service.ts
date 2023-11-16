import { ForbiddenException, Injectable } from '@nestjs/common';
import { EditUserDto } from './dto';
import { MongoHandlerService } from '../mongo/mongo.service';
import * as argon from 'argon2';
import { ObjectId } from 'mongodb';

@Injectable()
export class UserService {

    constructor(private mongo: MongoHandlerService) {}

    async editUser(id: ObjectId, dto: EditUserDto) {

        if (!ObjectId.isValid(id)) {
            throw new ForbiddenException("User does not exist")
        }

        const hash = await argon.hash(dto.password)

        await this.mongo.getUserDB().updateOne({_id: id}, {$set: {username: dto.username, hash}})

        return {username: dto.username}

    }
}
