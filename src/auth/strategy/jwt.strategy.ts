import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
//import { MongoClient } from 'mongodb';
import { MongoHandlerService } from '../../mongo/mongo.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt'){
    constructor (config: ConfigService, private mongo: MongoHandlerService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_SECRET')
        })
    }

    async validate(payload: any) {

        var user
        await this.mongo.getUserDB().findOne({username: payload.sub}).then(userFound => {user = userFound})
        delete user.hash
        return user
    }
}