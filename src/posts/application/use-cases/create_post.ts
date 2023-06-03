import { CommandHandler } from "@nestjs/cqrs"
import { InjectModel } from "@nestjs/mongoose"
import { InjectDataSource } from "@nestjs/typeorm"
import { Model } from "mongoose"
import { BlogsType } from "src/blogs/dto/BlogsType"
import { PostClass } from "src/posts/dto/PostClass"
import { PostRepository } from "src/posts/repositories/posts.repository"
import { LIKES } from "src/utils/types"
import { DataSource } from "typeorm"
import { v4 as uuidv4 } from "uuid"


export class CreatePostCommand {
    constructor(
        public title: string, 
        public content: string, 
        public shortDescription: string, 
        public bloggerId?: string, 
        public bloggerIdUrl?: string) {
        
    }
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase {
    constructor (
        protected postsRepository: PostRepository,
        @InjectModel('Blogs') protected bloggerModel: Model<BlogsType>,
        @InjectDataSource() protected dataSource: DataSource ) {}

    async execute(command: CreatePostCommand): Promise<object | string | null> {
        //FOR SQL DATABASE
        if (process.env.USE_DATABASE === "SQL") {
            const foundBlogger = await this.dataSource.query(`SELECT * FROM "Bloggers" WHERE id = $1`, [command.bloggerId])
        if (foundBlogger.length >= 1 && command.bloggerId) {
            // CREATE ON CLASS
            const newPost = new PostClass(uuidv4(), command.title, command.content, command.shortDescription, command.bloggerId, foundBlogger[0].name, (new Date()).toISOString(), {likesCount: 0, dislikesCount: 0, myStatus: LIKES.NONE})
            console.log(newPost)
            return await this.postsRepository.releasePost(newPost, command.bloggerId, command.bloggerIdUrl)
        }
        else { return null }
        }
        // FOR MONGO DATABASE
        else {
        const foundBlogger = await this.bloggerModel.findOne({ id: command.bloggerId }).lean()
        const foundBloggerW = await this.bloggerModel.findOne({ id: command.bloggerIdUrl }).lean()
        if (command.bloggerIdUrl && foundBloggerW !== null) {
            // Построено на классе
            const newPost = new PostClass(uuidv4(), command.title, command.content, command.shortDescription, command.bloggerIdUrl, foundBloggerW.name, (new Date()).toISOString(), {likesCount: 0, dislikesCount: 0, myStatus: LIKES.NONE})
        
            return await this.postsRepository.releasePost(newPost, command.bloggerIdUrl)
        }
        else if (foundBlogger !== null && command.bloggerId) {
            // Построено на классе
            const newPost = new PostClass(uuidv4(), command.title, command.content, command.shortDescription, command.bloggerId, foundBlogger.name,(new Date()).toISOString(), {likesCount: 0, dislikesCount: 0, myStatus: LIKES.NONE})
    
            return await this.postsRepository.releasePost(newPost, command.bloggerId, command.bloggerIdUrl)
        }
        else { return null }
    }
    }
}

