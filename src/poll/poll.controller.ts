import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PollService } from './poll.service';
import { PollDto } from './dto';
import { EditUserDto } from 'src/user/dto';
import { ObjectId } from 'mongodb';

@Controller('polls')
export class PollController {

    constructor(private pollService: PollService) {}

    @Get()
    getPoll() {
        return this.pollService.getQuestions()
    }

    @Post("/:id")
    votePoll() {}

    @UseGuards(AuthGuard('jwt'))
    @Post("/create")
    createPoll(@Body() dto: PollDto, @Req() req: Request) {
        return this.pollService.createQuestionsOnDatabase(dto, req["user"] as EditUserDto)
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete("/delete/:id")
    deletePoll(@Param('id') pollId: ObjectId) {
        this.pollService.deletePollFromDatabase(pollId)
    }

}
