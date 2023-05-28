import { MinLength, MaxLength, IsOptional, Matches, IsNotEmpty, IsUUID, IsEnum, Validate } from "class-validator"
import { LIKES } from "./types"
import { Transform, TransformFnParams } from "class-transformer";

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
    title: string;
    @MaxLength(100)
    shortDescription: string;
    @MaxLength(1000)
    content: string;
    //@BlogIdExists()
    blogId: string;
    blogName: string;
    createdAt: string;
    extendedLikesInfo: {
        likesCount: number;
        dislikesCount: number;
        myStatus: LIKES;
        newestLikes?: [
            {
                addedAt: Date
                userId: string
                login: string
            }
        ]
    }
    likeStorage?: [{
        addedAt: Date
        userId: string
        login: string
    }]
    dislikeStorage?: [{
        addedAt: Date
        userId: string
        login: string
    }]
}