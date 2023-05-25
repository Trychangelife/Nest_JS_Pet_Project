import { MinLength, MaxLength, IsOptional, Matches, IsNotEmpty, IsUUID, IsEnum } from "class-validator"
import { LIKES } from "./types"

const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
const loginRegex = /^[a-zA-Z0-9_-]*$/


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
export class Comment {
    @MinLength(20)
    @MaxLength(300)
    content: string
   
}

export class LikesDTO {
    @IsEnum(LIKES)
    likeStatus: string
}

export class Post {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
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