import { MinLength, MaxLength, IsOptional, Matches, IsNotEmpty, IsUUID, IsEnum, Validate } from "class-validator"
import { LIKES } from "./types"
import { Transform, TransformFnParams } from "class-transformer";
import { BlogIsExistRule } from "./validator.posts.form";

const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
const loginRegex = /^[a-zA-Z0-9_-]*$/
const websiteUrlRegex = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;
const nameRegex = /^[a-zA-Zа-яА-Я\s-]+$/;



export class AuthForm {
    @MinLength(3)
    @MaxLength(10)
    @IsOptional()
    login: string
    @MinLength(6)
    @MaxLength(20)
    @Matches(loginRegex)
    password: string
    @IsNotEmpty()
    @IsOptional()
    @Matches(emailRegex)
    email: string
    loginOrEmail: string
}
export class EmailForRecoveryPassword {
    @IsNotEmpty()
    @IsOptional()
    @Matches(emailRegex)
    email: string
}
export class NewPassword  {
    @MinLength(6)
    @MaxLength(20)
    newPassword: string
    recoveryCode: string
}
export class Blogs {
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @Matches(nameRegex)
    @MaxLength(15)
    name: string
    @Matches(websiteUrlRegex)
    @MaxLength(100)
    websiteUrl: string
    @MaxLength(500)
    description: string
   
}
export class Comment {
    @MinLength(20)
    @MaxLength(300)
    content: string
   
}

export class LikesDTO {
    @IsEnum(LIKES)
    likeStatus: string
}

export class PostTypeValidator {
    id: string;
    @MaxLength(30)
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @Matches(nameRegex)
    title: string;
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @MaxLength(100)
    @Matches(nameRegex)
    shortDescription: string;
    @MaxLength(1000)
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @Matches(nameRegex)
    content: string;
    blogId:string

}
// Наследование класса для прохождения тестов
export class PostTypeValidatorForCreate extends PostTypeValidator {
    @Validate(BlogIsExistRule, {message: "BlogId not exist"})
    blogId: string;
}