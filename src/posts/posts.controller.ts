import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/Auth_guards/jwt-auth.guard";
import { constructorPagination } from "src/pagination.constructor";
import { PostsType, UsersType } from "src/types/types";
import { PostsService } from "./posts.service";

@Controller('posts')
export class PostController {

    constructor(protected postsService: PostsService) {
    }
    @Get()
    async getAllPosts(@Query() query: {SearchNameTerm: string, PageNumber: string, PageSize: string}) {
        const paginationData = constructorPagination(query.PageSize as string, query.PageNumber as string);
        const getAllPosts: object = await this.postsService.allPosts(paginationData.pageSize, paginationData.pageNumber);
        return getAllPosts;
    }

    @Get(':id')
    async getPostByID(@Param() params) {
        const takePost: object | undefined = await this.postsService.targetPosts(params.id);
        if (takePost !== undefined) {
            return takePost
        }
        else {
            throw new HttpException('Post NOT FOUND',HttpStatus.NOT_FOUND)
        }
    }
    @UseGuards(JwtAuthGuard)
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
    @UseGuards(JwtAuthGuard)
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
    @UseGuards(JwtAuthGuard)
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
    // ?????????? ???? ?????????????? ?????????? (?????????????????? ?????????? ?????????????????? ?????????? ?? nestjs)
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
}
