
import { Schema } from "@nestjs/mongoose";
import { ObjectId, ServerApiVersion } from "mongodb";
import mongoose from "mongoose";
import { BloggersType, PostsType, RefreshTokenStorageType, ConfirmedAttemptDataType, CommentsType, UsersType,  RegistrationDataType, AuthDataType, EmailSendDataType, LIKES,  } from "./types/types";




export const bloggerSchema = new mongoose.Schema<BloggersType>({
    id: {type:String, required:true},
    name: {type:String, required:true},
    youtubeUrl: {type:String, required:true}
})
export const postSchema = new mongoose.Schema<PostsType>({
    id: {type:String, required:true},
    title: {type:String},
    shortDescription: {type:String},
    content: {type:String},
    bloggerId: {type:String, required:true},
    bloggerName: {type:String, required:true},
    addedAt: {type: Date, required: true},
    extendedLikesInfo: {
        likesCount: {type: Number, required:true, default: 0},
        dislikesCount: {type: Number, required:true, default: 0},
        myStatus: {type: String},
        newestLikes: [
            {
                addedAt: {type: Date, required:false},
                userId: {type: String, required:false},
                login: {type: String, required:false}
            }
        ]
    },
    likeStorage: [
        {
        addedAt: {type: Date, required:false},
        userId: {type: String, required:false},
        login: {type: String, required:false}
}  ],
    dislikeStorage: [
        {
        addedAt: {type: Date, required:false},
        userId: {type: String, required:false},
        login: {type: String, required:false}
    }
]
}
    
    )
export const commentsSchema = new mongoose.Schema<CommentsType>({
    id: {type:String, required:true},
    content: {type:String, required:true},
    userId: {type:String, required:true},
    userLogin: {type:String, required:true},
    addedAt: {type:String, required:true},
    postId: {type:String, required:true},
    likesInfo: {
        likesCount: {type: Number, required:true, default: 0},
        dislikesCount: {type: Number, required:true, default: 0},
        myStatus: {type: String},
    },
    likeStorage: [
        {
        addedAt: {type: Date, required:false},
        userId: {type: String, required:false},
        login: {type: String, required:false}
}  ],
    dislikeStorage: [
        {
        addedAt: {type: Date, required:false},
        userId: {type: String, required:false},
        login: {type: String, required:false}
    }
]
})

export const usersSchema = new mongoose.Schema<UsersType>({
    _id: {type: ObjectId, required: true},
    id: {type: String, required: true},
    login: {type: String, required: true},
    email: {type: String, required: true},
    accountData: {
        passwordHash: {type: String, required: true},
        passwordSalt: {type: String, required: true},
        
    },
    emailConfirmation: {
        codeForActivated: {type: String, required: true},
        activatedStatus: {type: String, required: true}
    }
})
export const registrationDataSchema = new mongoose.Schema<RegistrationDataType>({
    ip: {type: String, required: true},
    dateRegistation: {type: Date, required: true},
    email: {type: String, required: true}
})
export const authDataSchema = new mongoose.Schema<AuthDataType>({
    ip: {type: String, required: true},
    tryAuthDate: {type: Date, required: true},
    login: {type: String, required: true}
})
export const emailSendSchema = new mongoose.Schema<EmailSendDataType>({
    ip: {type: String, required: true},
    emailSendDate: {type: Date, required: true},
    email: {type: String, required: true}
})
export const codeConfirmSchema = new mongoose.Schema<ConfirmedAttemptDataType>({
    ip: {type: String, required: true},
    tryConfirmDate: {type: Date, required: true},
    code: {type: String, required: true}
})
export const refreshTokenSchema = new mongoose.Schema<RefreshTokenStorageType>({
    userId: {type: String, required: true},
    refreshToken: {type: String, required: true},
})


export const bloggerModel = mongoose.model('bloggers', bloggerSchema)
export const postsModel = mongoose.model('posts', postSchema)
export const usersModel = mongoose.model('users', usersSchema)
export const commentsModel = mongoose.model('comments', commentsSchema)
export const registrationDataModel = mongoose.model('registrationData', registrationDataSchema)
export const authDataModel = mongoose.model('authData', authDataSchema)
export const emailSendModel = mongoose.model('emailSend', emailSendSchema)
export const codeConfirmModel = mongoose.model('confirmAttemptLog', codeConfirmSchema)
export const refreshTokenModel = mongoose.model('refreshToken', refreshTokenSchema)


// export async function runDb () {
// try {
//     await mongoose.connect(uri, options)
//     console.log("Connected successfully to mongo server")
// } catch (e) {
//     console.error(e);
//     await mongoose.disconnect()
// }}

