import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { BasicAuthGuard } from "src/Auth_guards/basic_auth_guard";
import { JwtAuthGuard } from "src/Auth_guards/jwt-auth.guard";
import { JwtServiceClass } from "src/Auth_guards/jwt.service";
import { constructorPagination } from "src/pagination.constructor";
import { LIKES, PostsType, UsersType } from "src/types/types";
import { PostsService } from "./posts.service";

@Controller('posts')
export class PostController {

    constructor(protected postsService: PostsService, protected jwtServiceClass: JwtServiceClass) {
    }
    @Get()
    async getAllPosts(@Query() query: {SearchNameTerm: string, PageNumber: string, PageSize: string}) {
        const paginationData = constructorPagination(query.PageSize as string, query.PageNumber as string);
        const getAllPosts: object = await this.postsService.allPosts(paginationData.pageSize, paginationData.pageNumber);
        return getAllPosts;
    }

    @Get(':id')
    async getPostByID(@Param() params, @Req() req) {
        try {
            const token = req.headers.authorization.split(' ')[1]
            const userId = await this.jwtServiceClass.getUserByToken(token)
            const takePost: object | undefined = await this.postsService.targetPosts(params.id, userId);
            if (takePost !== undefined) {
                return takePost
            }
            else {
                throw new HttpException('Post NOT FOUND',HttpStatus.NOT_FOUND)
            }
        } catch (error) {
            const takePost: object | undefined = await this.postsService.targetPosts(params.id);
            if (takePost !== undefined) {
                return takePost
            }
            else {
                throw new HttpException('Post NOT FOUND',HttpStatus.NOT_FOUND)
            }
        }
        
    }
    @UseGuards(BasicAuthGuard)
    @Post()
    async createPost(@Body() post: PostsType) {
        const giveMePost: string | object | null = await this.postsService.releasePost(post.title,post.content, post.shortDescription, post.bloggerId);
        if (giveMePost == null) {
            throw new HttpException('Something wrong, check input data',HttpStatus.BAD_REQUEST)
            // res.status(400).json({ errorsMessages: [{ message: "blogger not found", field: "bloggerId" }], resultCode: 1 });
        }
        else {
            throw new HttpException(giveMePost ,HttpStatus.CREATED);
        }
    }
    @UseGuards(BasicAuthGuard)
    @Put(':postId')
    async updatePost(@Param() params, @Body() post: PostsType) {
        const afterChanged: object | string = await this.postsService.changePost(params.postId, post.title, post.shortDescription, post.content, post.bloggerId);
        if (afterChanged !== "404" && afterChanged !== '400') {
            throw new HttpException(afterChanged,HttpStatus.ACCEPTED)
        }
        else if (afterChanged === "400") {
            throw new HttpException('Something wrong, check input data',HttpStatus.BAD_REQUEST)
            //res.status(400).json({ errorsMessages: [{ message: "blogger not found", field: "bloggerId" }], resultCode: 1 });
        }
        else {
            throw new HttpException('Post NOT FOUND',HttpStatus.NOT_FOUND)
        }

    }
    @UseGuards(BasicAuthGuard)
    @Delete(':id')
    async deletePostById(@Param() params,) {
        const deleteObj: boolean = await this.postsService.deletePost(params.id);
        if (deleteObj === true) {
           return HttpStatus.NO_CONTENT
        }
        else {
            throw new HttpException('Post NOT FOUND',HttpStatus.NOT_FOUND)
        }
    }
    // Здесь не хватает юзера (проверить после занесения юзера в nestjs)
    @UseGuards(JwtAuthGuard)
    @Post(':postId/comments')
    async createCommentForPost(@Param('postId') postId: string, @Body() post: PostsType, @Req() req) {
        const newComment = await this.postsService.createCommentForSpecificPost(postId, post.content, req.user!.id, req.user!.login);
        if (newComment) {
            return newComment
        }
        else {
            throw new HttpException('Post NOT FOUND',HttpStatus.NOT_FOUND)
        }

    }
    @Get(':postId/comments')
    async getCommentsByPostId(@Query() query: {SearchNameTerm: string, PageNumber: string, PageSize: string}, @Param() params,) {
        const paginationData = constructorPagination(query.PageSize as string, query.PageNumber as string);
        const newComment = await this.postsService.takeCommentByIdPost(params.postId, paginationData.pageNumber, paginationData.pageSize);
        if (newComment) {
            return newComment
        }
        else {
            throw new HttpException("Post doesn't exists",HttpStatus.NOT_FOUND)
        }

    }
    @UseGuards(JwtAuthGuard)
    @Put(':postId/like-status')
    async like_dislike(@Param() params, @Body() likeStatus: LIKES, @Req() req) {
        const like_dislike: object | string = await this.postsService.like_dislike(params.postId, likeStatus, req.user!.id, req.user!.login);
        if (like_dislike !== "404" && like_dislike !== '400') {
            throw new HttpException(like_dislike,HttpStatus.NO_CONTENT)
        }
        else if (like_dislike === "400") {
            throw new HttpException({ errorsMessages: [{ message: "blogger not found", field: "bloggerId" }], resultCode: 1 },HttpStatus.BAD_REQUEST)
            //res.status(400).json({ errorsMessages: [{ message: "blogger not found", field: "bloggerId" }], resultCode: 1 });
        }
        else {
            throw new HttpException('Post NOT FOUND',HttpStatus.NOT_FOUND)
        }
}
}