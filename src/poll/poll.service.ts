import { BadRequestException, GoneException, HttpCode, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { randomInt } from 'crypto';
import { Long, MongoClient, ObjectId } from 'mongodb';
import { MongoHandlerService } from 'src/mongo/mongo.service';
import { PollDto } from './dto';
import { EditUserDto } from 'src/user/dto';
import { STATUS_CODES } from 'http';
import { VotePollDto } from './dto/vote-poll.dto';

var questions: [number, ObjectId, Date][] = []

@Injectable()
export class PollService {

    constructor (private mongo: MongoHandlerService) {}

    async getQuestions() {
        const question = await this.mongo.getPollDB().aggregate([{$sample: {size: 1}}]).toArray()
        console.log(question)
        questions.push(question[0] as any)

        return question
    }

    async createQuestionsOnDatabase(dto: PollDto, user: EditUserDto) {
        await this.mongo.getPollDB().insertOne({username: user.username, question: dto.question, options: dto.optionsStrings}).catch((reason) => {
            console.log(reason)
            throw new InternalServerErrorException
        })
    }

    async deletePollFromDatabase(id: ObjectId) {
        questions.forEach((value, index) => {
            if (value[1] == id) {
                questions.splice(index, 1)
            }
        })
        await this.mongo.getPollDB().deleteOne({"_id": id}).catch((reason) => {console.log(reason); throw new InternalServerErrorException})
    }

    async votePoll(id: number, dto: VotePollDto) {
        var realId: ObjectId
        questions.forEach((value, index) => {
            if (value[0] == id) {
                realId = value[1]
                questions.splice(index, 1)
            }
        })

        if (realId == undefined) {
            throw new GoneException
        }
        var answer = await this.mongo.getPollDB().findOne({_id: realId})["options"]
        answer[dto as number] += 1
        this.mongo.getPollDB().updateOne({_id: realId}, {options: answer})
    }


}

setInterval(() => {
    questions.forEach(function(value, index) {
        if (new Date().getMinutes() - value[2].getMinutes() >= 15) {
            questions.splice(index, 1)
        }
    })
})