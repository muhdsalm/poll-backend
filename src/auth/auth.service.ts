import { ForbiddenException, Injectable } from "@nestjs/common";
import { MongoHandlerService } from "../mongo/mongo.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2'
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class AuthService {

    constructor(private mongo: MongoHandlerService, private jwt: JwtService, private config: ConfigService) {}

    async signin(dto: AuthDto) {

        var account

        await this.mongo.getUserDB().findOne({username: dto.username}).then(value => { if(!value) {throw new ForbiddenException("Username does not exist")} else {account = value} })

        await argon.verify(account.hash, dto.password).then(verified => {if (!verified) {throw new ForbiddenException("Password incorrect")}})

        return this.signToken(dto.username)
    }

    async signup(dto: AuthDto) {

        const hash = await argon.hash(dto.password)

        await this.mongo.getUserDB().insertOne({username: dto.username, hash}).catch((err) => { if (err.code === 11000) {throw new ForbiddenException("Username taken")}})
        

        return this.signToken(dto.username)
    }

    async signToken(username: string): Promise<{access_token: string}> {
        const payload = {
            sub: username
        }
        const secret = this.config.get('JWT_SECRET')

        const token = await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: secret
        })
        return {
            access_token: token,
        }
    }

}