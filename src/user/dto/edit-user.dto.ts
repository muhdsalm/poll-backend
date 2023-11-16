import { IsNotEmpty, IsString } from "class-validator";
import { ObjectId } from "mongodb";

export class EditUserDto {

    @IsNotEmpty()
    @IsString()
    username: string

    @IsNotEmpty()
    @IsString()
    password: string


}