import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsEmail, IsNotEmpty, IsString, MaxLength, min, MinLength } from "class-validator";
import { ObjectId } from "mongodb";




export enum LIKES {
    LIKE = "Like",
    DISLIKE = "Dislike",
    NONE = "None"
}

export type NewestLikes = {
    addedAt: Date,
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
export class BlogsClass {
    constructor(public  id: string, public name: string, public description: string ,public websiteUrl: string, public createdAt: Date, public isMembership: boolean ) {
    }
}
export type BlogsType = {
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: Date;
    isMembership: boolean;

}

export class Comments {
    constructor(
        public id: string, 
        public content: string, 
        public commentatorInfo: {
            userId: string;
            userLogin: string;
        },
        public createdAt: string,
        public postId: string,
        public likesInfo: {
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
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    createdAt: string;
    postId: string;
    likesInfo: {
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
        public blogId: string,
        public blogName: string,
        public createdAt: Date,
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
    blogId: string;
    blogName: string;
    createdAt: Date;
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


