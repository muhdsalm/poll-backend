import { Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('polls')
export class PollController {

    @Get()
    getPoll() {}

    @Post("/:id")
    votePoll() {}

    @UseGuards(AuthGuard('jwt'))
    @Post("/create")
    createPoll() {}

    @UseGuards(AuthGuard('jwt'))
    @Delete("/delete/:id")
    deletePoll() {

    }

}
