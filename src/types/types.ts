import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsEmail, IsString, MaxLength, min, MinLength } from "class-validator";
import { ObjectId } from "mongodb";
@Schema()
export class BloggerClass {
    constructor(public  id: string, public name: string, public youtubeUrl: string ) {
    }
}
export type BloggersType = {
    id: string;
    name: string;
    youtubeUrl: string;
}

export class Comments {
    constructor(public commentId: string, public content: string, public userId: string, public userLogin: string, public addedAt: string,public postId: string ) {
    }
}
export type CommentsType = {
    commentId: string;
    content: string;
    userId: string;
    userLogin: string;
    addedAt: string;
    postId: string;
};

@Schema()
export class Post {
    constructor(public id: string, public title: string, public shortDescription: string, public content: string, public bloggerId: string,public bloggerName: string ) {
    }
}
export type PostsType = {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    bloggerId: string;
    bloggerName: string;
};
export class CreateUser {
    @IsEmail()
    email: string
    @MinLength(5)
    @MaxLength(10)
    login: string
    @IsString()
    id: string
    @MinLength(3)
    password: string
}

export class User { 
    constructor(
        public _id: ObjectId, 
        public id: string, 
        public login: string,
        public email: string,
        public accountData: { passwordHash: string, passwordSalt: string},
        public emailConfirmation: {codeForActivated: string, activatedStatus: boolean}) {}
}
export type UsersType = {
    _id: ObjectId;
    id: string;
    login: string;
    email: string
    accountData: {
        passwordHash: string;
        passwordSalt: string;
    }
    emailConfirmation: {
        codeForActivated: string
        activatedStatus: boolean
    }
};


export type RegistrationDataType = {
    ip: string
    dateRegistation: Date
    email: string
}
export type AuthDataType = {
    ip: string
    tryAuthDate: Date
    login: string
}
export type EmailSendDataType = {
    ip: string
    emailSendDate: Date
    email: string
}
export type ConfirmedAttemptDataType = {
    ip: string
    tryConfirmDate: Date
    code: string
}
export type RefreshTokenStorageType = {
    userId: string
    refreshToken: string
}


