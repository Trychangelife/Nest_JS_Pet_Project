import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsEmail, IsNotEmpty, IsString, MaxLength, min, MinLength } from "class-validator";
import { ObjectId } from "mongodb";




export enum LIKES {
    LIKE = "Like",
    DISLIKE = "Dislike",
    NONE = "None"
}

export type NewestLikes = {
    addedAt: string,
    userId: string,
    login: string
}

export type extendedLikesInfo = {
    likesCount: number,
    dislikesCount: number,
    myStatus: LIKES,
    newestLikes: NewestLikes
}

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
    constructor(
        public id: string, 
        public content: string, 
        public userId: string, 
        public userLogin: string, 
        public addedAt: string,
        public postId: string,
        public extendedLikesInfo: {
            likesCount: number,
            dislikesCount: number,
            myStatus: LIKES,
        },
        public likeStorage?: [{
            addedAt: Date,
            userId: string,
            login: string
        }],
        public dislikeStorage?: [{
            addedAt: Date,
            userId: string,
            login: string
        }]) {
    }
}
export type CommentsType = {
    id: string;
    content: string;
    userId: string;
    userLogin: string;
    addedAt: string;
    postId: string;
    extendedLikesInfo: {
        likesCount: number;
        dislikesCount: number;
        myStatus: LIKES;
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
};

@Schema()
export class Post {
    constructor(
        public id: string, 
        public title: string, 
        public shortDescription: string, 
        public content: string, 
        public bloggerId: string,
        public bloggerName: string,
        public addedAt: Date,
        public extendedLikesInfo: {
            likesCount: number,
            dislikesCount: number,
            myStatus: LIKES,
            newestLikes?: [
                {
                    addedAt: Date,
                    userId: string,
                    login: string
                }
            ]
        },
        public likeStorage?: [{
            addedAt: Date,
            userId: string,
            login: string
        }],
        public dislikeStorage?: [{
            addedAt: Date,
            userId: string,
            login: string
        }]
        ) {
    }
}
export type PostsType = {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    bloggerId: string;
    bloggerName: string;
    addedAt: Date;
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
    
};
export class CreateUser {
 
    email: string
    login: string
    id: string
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


