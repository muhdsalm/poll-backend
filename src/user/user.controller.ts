import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EditUserDto } from './dto';
import { UserService } from './user.service';
import { ObjectId } from 'mongodb';

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UserController {

    constructor(private userService: UserService) {}

    @Get("me")
    getMe(@Req() req: Request) {
        console.log(req["user"])
        return req["user"]
    }

    @Patch('me')
    editUser(@Req() req: Request, @Body() dto: EditUserDto) {
        return this.userService.editUser(req["user"]["_id"], dto)
    }
}
