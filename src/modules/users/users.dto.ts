import { IsArray, IsEmail, IsString, IsOptional, MinLength } from 'class-validator'

export class CreateUserDto {
    @IsEmail()
    email!: string

    @IsString()
    @MinLength(8)
    password!: string

    @IsOptional()
    @IsArray()
    roles!: string[]
}
