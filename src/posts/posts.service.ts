import 'dotenv/config'
import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { BloggersType, Comments, CommentsType, LIKES, Post, PostsType } from "src/types/types"
import { PostRepository } from "./posts.repository"
import { v4 as uuidv4 } from "uuid"
import { DataSource } from 'typeorm'
import { InjectDataSource } from '@nestjs/typeorm'


@Injectable()
export class PostsService {

    constructor (
        protected postsRepository: PostRepository, 
        @InjectModel('Blogger') protected bloggerModel: Model<BloggersType>,
        @InjectModel('Posts') protected postsModel: Model<PostsType>,
        @InjectDataSource() protected dataSource: DataSource) {}

    async allPosts(pageSize: number, pageNumber: number, userId?: string): Promise<object> {
        let skip = 0
        if (pageNumber && pageSize) {
            skip = (pageNumber - 1) * pageSize
        }
        return this.postsRepository.allPosts(skip, pageSize, pageNumber, userId)
    }
    async targetPosts(postId: string, userId?: string): Promise<object | undefined> {
        return await this.postsRepository.targetPosts(postId, userId)
    }
    async allPostsSpecificBlogger(bloggerId: string, page?: number, pageSize?: number, userId?: string): Promise<object | undefined> {
        let skip = 0
        if (page && pageSize) {
            skip = (page - 1) * pageSize
        }

        return await this.postsRepository.allPostsSpecificBlogger(bloggerId, skip, pageSize, page, userId)
    }
    async releasePost(title: string, content: string, shortDescription: string, bloggerId?: string, bloggerIdUrl?: string): Promise<object | string | null> {
        //ДЛЯ БАЗЫ SQL
        if (process.env.USE_DATABASE === "SQL") {
            const foundBlogger = await this.dataSource.query(`SELECT * FROM "Bloggers" WHERE id = $1`, [bloggerId])
        if (foundBlogger.length >= 1 && bloggerId) {
            // Построено на классе
            const newPost = new Post(uuidv4(), title, content, shortDescription, bloggerId, foundBlogger[0].name, new Date(), {likesCount: 0, dislikesCount: 0, myStatus: LIKES.NONE})
            console.log(newPost)
            return await this.postsRepository.releasePost(newPost, bloggerId, bloggerIdUrl)
        }
        else { return null }
        }
        // ДЛЯ БАЗЫ MONGO
        else {
        const foundBlogger = await this.bloggerModel.findOne({ id: bloggerId }).lean()
        const foundBloggerW = await this.bloggerModel.findOne({ id: bloggerIdUrl }).lean()
        if (bloggerIdUrl && foundBloggerW !== null) {
            // Построено на классе
            const newPost = new Post(uuidv4(), title, content, shortDescription, bloggerIdUrl, foundBloggerW.name, new Date(), {likesCount: 0, dislikesCount: 0, myStatus: LIKES.NONE})
            console.log(newPost)
            return await this.postsRepository.releasePost(newPost, bloggerIdUrl)
        }
        else if (foundBlogger !== null && bloggerId) {
            // Построено на классе
            const newPost = new Post(uuidv4(), title, content, shortDescription, bloggerId, foundBlogger.name, new Date(), {likesCount: 0, dislikesCount: 0, myStatus: LIKES.NONE})
            console.log(newPost)
            return await this.postsRepository.releasePost(newPost, bloggerId, bloggerIdUrl)
        }
        else { return null }
    }
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
        const createdComment = new Comments(uuidv4(), content, userId, userLogin, (new Date()).toString(), postId, {likesCount: 0, dislikesCount: 0, myStatus: LIKES.NONE})
        return this.postsRepository.createCommentForSpecificPost(createdComment)
    }
        if (foundPost == null) {
            return false}
            else {
                return false
            }
    }
    async takeCommentByIdPost (postId: string, page: number, pageSize: number, userId?: string): Promise<object | boolean> {
        let skip = 0
        if (page && pageSize) {
            skip = (page - 1) * pageSize
        }
        return await this.postsRepository.takeCommentByIdPost(postId, skip, pageSize, page, userId)
    }
    async like_dislike (postId: string, likeStatus: LIKES, userId: string, login: string): Promise<string | object> {
        return await this.postsRepository.like_dislike(postId, likeStatus, userId, login)
    }
}