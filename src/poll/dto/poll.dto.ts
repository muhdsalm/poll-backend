import { IsNotEmpty, IsString } from "class-validator";

export class PollDto {

    @IsNotEmpty()
    @IsString()
    question: string

    @IsNotEmpty()
    optionsStrings: string[]

}