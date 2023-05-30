import { BadRequestException, Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseEnumPipe, Post, Put, Query, Req, Res, UseFilters, UseGuards } from "@nestjs/common";
import { BasicAuthGuard } from "../Auth_guards/basic_auth_guard";
import { JwtAuthGuard } from "../Auth_guards/jwt-auth.guard";
import { JwtServiceClass } from "../Auth_guards/jwt.service";
import { constructorPagination } from "../pagination.constructor";
import { LIKES, PostsType, UsersType } from "../types/types";
import { PostsService } from "./posts.service";
import { HttpExceptionFilter } from "../exception_filters/exception_filter";
import { Comment, PostTypeValidator, PostTypeValidatorForCreate } from "../types/class-validator.form";

@Controller('posts')
export class PostController {

    constructor(protected postsService: PostsService, protected jwtServiceClass: JwtServiceClass) {
    }
    @Get()
    async getAllPosts(@Query() query: {searchNameTerm: string, pageNumber: string, pageSize: string, sortBy: string, sortDirection: string}, @Req() req) {
        try {
            const token = req.headers.authorization.split(' ')[1]
            const userId = await this.jwtServiceClass.getUserByAccessToken(token)
            const paginationData = constructorPagination(query.pageSize as string, query.pageNumber as string, query.sortBy as string, query.sortDirection as string);
            const getAllPosts: object = await this.postsService.allPosts(paginationData.pageSize, paginationData.pageNumber, userId);
            return getAllPosts;
        } catch (error) {
            const paginationData = constructorPagination(query.pageSize as string, query.pageNumber as string, query.sortBy as string, query.sortDirection as string);
            const getAllPosts: object = await this.postsService.allPosts(paginationData.pageSize, paginationData.pageNumber);
            return getAllPosts;
        }
    }

    @Get(':id')
    async getPostByID(@Param() params, @Req() req) {
        try {
            const token = req.headers.authorization.split(' ')[1]
            const userId = await this.jwtServiceClass.getUserByAccessToken(token)
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
    @UseFilters(new HttpExceptionFilter())
    @Post()
    async createPost(@Body() post: PostTypeValidatorForCreate, @Res() res) {
        const createdPost: string | object | null = await this.postsService.releasePost(post.title,post.content, post.shortDescription, post.blogId);
        if (createdPost == null) {
            throw new HttpException('Something wrong, check input data',HttpStatus.BAD_REQUEST)
            // res.status(400).json({ errorsMessages: [{ message: "blogger not found", field: "blogId" }], resultCode: 1 });
        }
        else {
            res.status(201).send(createdPost)
            //throw new HttpException(createdPost ,HttpStatus.CREATED);
        }
    }
    @UseGuards(BasicAuthGuard)
    @UseFilters(new HttpExceptionFilter())
    @Put(':postId')
    async updatePost(@Param() params, @Body() post: PostTypeValidatorForCreate) {
        const afterChanged: object | string = await this.postsService.changePost(params.postId, post.title, post.shortDescription, post.content, post.blogId);
        if (afterChanged !== "404" && afterChanged !== '400') {
            //throw new HttpException(afterChanged,HttpStatus.ACCEPTED)
            throw new HttpException(afterChanged,HttpStatus.NO_CONTENT)
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
    async deletePostById(@Param() params, @Res() res) {
        const deleteObj: boolean = await this.postsService.deletePost(params.id);
        console.log("here")
        if (deleteObj === true) {
           //return HttpStatus.NO_CONTENT
           throw new HttpException('Post was DELETED',HttpStatus.NO_CONTENT)
        }
        else {
            throw new HttpException('Post NOT FOUND',HttpStatus.NOT_FOUND)
        }
    }
    @UseGuards(JwtAuthGuard)
    @UseFilters(new HttpExceptionFilter())
    @Post(':postId/comments')
    async createCommentForPost(@Param('postId') postId: string, @Body() content: Comment, @Req() req) {
        const newComment = await this.postsService.createCommentForSpecificPost(postId, content.content, req.user!.id, req.user!.login);
        if (newComment) {
            return newComment
        }
        else {
            throw new HttpException('Post NOT FOUND',HttpStatus.NOT_FOUND)
        }

    } 
    @Get(':postId/comments')
    async getCommentsByPostId(@Query() query: {searchNameTerm: string, pageNumber: string, pageSize: string, sortBy: string, sortDirection: string}, @Param() params, @Req() req) {
        try {
            const token = req.headers.authorization.split(' ')[1]
            const userId = await this.jwtServiceClass.getUserByAccessToken(token)
            const paginationData = constructorPagination(query.pageSize as string, query.pageNumber as string, query.sortBy as string, query.sortDirection as string);
            const newComment = await this.postsService.takeCommentByIdPost(params.postId, paginationData.pageNumber, paginationData.pageSize,userId, paginationData.sortBy, paginationData.sortDirection);
                if (newComment) {
                    return newComment
            }
                else {
                     throw new HttpException("Post doesn't exists",HttpStatus.NOT_FOUND)
        }
        } catch (error) {
            const paginationData = constructorPagination(query.pageSize as string, query.pageNumber as string, query.sortBy as string, query.sortDirection as string);
            const userIdMok = 'just'
            const newComment = await this.postsService.takeCommentByIdPost(params.postId, paginationData.pageNumber, paginationData.pageSize, userIdMok, paginationData.sortBy, paginationData.sortDirection);
        if (newComment) {
            return newComment
        }
        else {
            throw new HttpException("Post doesn't exists",HttpStatus.NOT_FOUND)
        }
        }
    }

    @UseGuards(JwtAuthGuard)
    @Put(':postId/like-status')
    async like_dislike(
        @Param('postId') postId: string, 
        @Body('likeStatus', new ParseEnumPipe(LIKES, {
            errorHttpStatusCode: HttpStatus.BAD_REQUEST,
            exceptionFactory: error => {
                throw new BadRequestException({
                    errorsMessages: [{
                        message: error,
                        field: "likeStatus"
                    }]
                })
            }
        })) likeStatus: LIKES, @Req() req) {
        //await this.postsService.targetPosts()
        const like_dislike: object | string = await this.postsService.like_dislike(postId, likeStatus, req.user!.id, req.user!.login);
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