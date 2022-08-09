import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Put, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/Auth_guards/jwt-auth.guard";
import { JwtServiceClass } from "src/Auth_guards/jwt.service";
import { CommentsType, LIKES } from "src/types/types";
import { CommentsService } from "./comments.service";

@Controller('comments')
export class CommentsController {

    constructor(protected commentsService: CommentsService, protected jwtServiceClass: JwtServiceClass) {
    }
    @Get(':id')
    async getCommentById(@Param() params, @Req() req) {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const userId = await this.jwtServiceClass.getUserByToken(token)
        const result = await this.commentsService.getCommentsById(params.id, userId);
        if (result !== null) {
            return result
        }
        else {
            throw new HttpException('Comments NOT FOUND',HttpStatus.NOT_FOUND)
        }
    } catch (error) {
        const result = await this.commentsService.getCommentsById(params.id);
        if (result !== null) {
            return result
        }
        else {
            throw new HttpException('Comments NOT FOUND',HttpStatus.NOT_FOUND)
        }
    }
        
    }
    @UseGuards(JwtAuthGuard)
    @Put(':commentId')
    async updateCommentByCommentId(@Param() params, @Body() comment: CommentsType, @Req() req) {
        const result = await this.commentsService.updateCommentByCommentId(params.commentId, comment.content, req.user!.id);
        if (result) {
            return HttpStatus.NO_CONTENT
        }
        else if (result == null) {
            throw new HttpException('Comments NOT FOUND',HttpStatus.NOT_FOUND)
        }
        else {
            throw new HttpException('FORBIDDEN',HttpStatus.FORBIDDEN)
        }
    }
    @UseGuards(JwtAuthGuard)
    @Delete(':commentId')
    async deleteCommentById(@Param('commentId') params, @Req() req) {
        const resultDelete = await this.commentsService.deleteCommentByCommentId(params.commentId, req.user!.id);
        if (resultDelete) {
            return HttpStatus.NO_CONTENT
        }
        else if (resultDelete == null) {
            throw new HttpException('Comments NOT FOUND',HttpStatus.NOT_FOUND)
        }
        else {
            throw new HttpException('FORBIDDEN',HttpStatus.FORBIDDEN)
        }
    }
    @UseGuards(JwtAuthGuard)
    @Put(':commentId/like-status')
    async like_dislike(@Param() params, @Body() likeStatus: LIKES, @Req() req) {
        const like_dislike: object | string = await this.commentsService.like_dislike(params.commentId, likeStatus, req.user!.id, req.user!.login);
        if (like_dislike !== "404" && like_dislike !== '400') {
            throw new HttpException(like_dislike,HttpStatus.NO_CONTENT)
        }
        else if (like_dislike === "400") {
            throw new HttpException({ errorsMessages: [{ message: "blogger not found", field: "bloggerId" }], resultCode: 1 },HttpStatus.BAD_REQUEST)
            //res.status(400).json({ errorsMessages: [{ message: "blogger not found", field: "bloggerId" }], resultCode: 1 });
        }
        else {
            throw new HttpException('Comment NOT FOUND',HttpStatus.NOT_FOUND)
        }
    }
}
