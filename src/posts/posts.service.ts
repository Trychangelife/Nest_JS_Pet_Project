import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { BloggersType, Comments, CommentsType, Post, PostsType } from "src/types/types"
import { PostRepository } from "./posts.repository"
import { v4 as uuidv4 } from "uuid"

@Injectable()
export class PostsService {

    constructor (
        protected postsRepository: PostRepository, 
        @InjectModel('Blogger') protected bloggerModel: Model<BloggersType>,
        @InjectModel('Posts') protected postsModel: Model<PostsType>) {}

    async allPosts(pageSize: number, pageNumber: number,): Promise<object> {
        let skip = 0
        if (pageNumber && pageSize) {
            skip = (pageNumber - 1) * pageSize
        }
        return this.postsRepository.allPosts(skip, pageSize, pageNumber)
    }
    async targetPosts(postId: string): Promise<object | undefined> {
        return await this.postsRepository.targetPosts(postId)
    }
    async allPostsSpecificBlogger(bloggerId: string, page?: number, pageSize?: number): Promise<object | undefined> {
        let skip = 0
        if (page && pageSize) {
            skip = (page - 1) * pageSize
        }

        return await this.postsRepository.allPostsSpecificBlogger(bloggerId, skip, pageSize, page)
    }
    async releasePost(title: string, content: string, shortDescription: string, bloggerId?: string, bloggerIdUrl?: string): Promise<object | string | null> {
        const foundBlogger = await this.bloggerModel.findOne({ id: bloggerId })
        const foundBloggerW = await this.bloggerModel.findOne({ id: bloggerIdUrl })
        if (bloggerIdUrl && foundBloggerW !== null) {
            // Построено на классе
            const newPost = new Post(uuidv4(), title, content, shortDescription, bloggerIdUrl, foundBloggerW.name)
            return await this.postsRepository.releasePost(newPost, bloggerIdUrl)
        }
        else if (foundBlogger !== null && bloggerId) {
            // Построено на классе
            const newPost = new Post(uuidv4(), title, content, shortDescription, bloggerId, foundBlogger.name)
            return await this.postsRepository.releasePost(newPost, bloggerId, bloggerIdUrl)
        }
        else { return null }
    }
    async changePost(postId: string, title: string, shortDescription: string, content: string, bloggerId: string): Promise<string | object> {

        return await this.postsRepository.changePost(postId, title, shortDescription, content, bloggerId)
    }
    async deletePost(deleteId: string): Promise<boolean> {
        return await this.postsRepository.deletePost(deleteId)

    }
    async createCommentForSpecificPost(postId: string, content: string, userId: string, userLogin: string): Promise<CommentsType | boolean> {
        const foundPost = await this.postsModel.findOne({ id: postId })
        if(foundPost) {
        // Построено на классе
        const createdComment = new Comments(uuidv4(), content, userId, userLogin, (new Date()).toString(), postId)
        return this.postsRepository.createCommentForSpecificPost(createdComment)
    }
        if (foundPost == null) {
            return false}
            else {
                return false
            }
    }
    async takeCommentByIdPost (postId: string, page: number, pageSize: number): Promise<object | boolean> {
        let skip = 0
        if (page && pageSize) {
            skip = (page - 1) * pageSize
        }
        return await this.postsRepository.takeCommentByIdPost(postId, skip, pageSize, page,)
    }
    async like_dislike (postId: string, page: number, pageSize: number): Promise<object | boolean> {
        let skip = 0
        if (page && pageSize) {
            skip = (page - 1) * pageSize
        }
        return await this.postsRepository.takeCommentByIdPost(postId, skip, pageSize, page,)
    }
}