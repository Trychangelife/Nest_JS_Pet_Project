import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Put, Req, Res, UseFilters, UseGuards } from "@nestjs/common";
import { IsNotEmpty, MaxLength, MinLength } from "class-validator";
import { JwtAuthGuard } from "../Auth_guards/jwt-auth.guard";
import { JwtServiceClass } from "../Auth_guards/jwt.service";
import { CommentsType, LIKES } from "../types/types";
import { CommentsService } from "./comments.service";
import { HttpExceptionFilter } from "../exception_filters/exception_filter";
import { Comment } from "../types/class-validator.form";



export class LikesDTO {
    @IsNotEmpty()
    likeStatus: string
}


@Controller('comments')
export class CommentsController {

    constructor(protected commentsService: CommentsService, protected jwtServiceClass: JwtServiceClass) {
    }
    @Get(':id')
    async getCommentById(@Param() params, @Req() req) {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const userId = await this.jwtServiceClass.getUserByAccessToken(token)
        const result = await this.commentsService.getCommentsById(params.id, userId);
        if (result !== null && result !== undefined) {
            return result
        }
        else {
            throw new HttpException('Comments NOT FOUND',HttpStatus.NOT_FOUND)
        }
    } catch (error) {
        const result = await this.commentsService.getCommentsById(params.id);
        if (result !== null && result !== undefined) {
            return result
        }
        else {
            throw new HttpException('Comments NOT FOUND',HttpStatus.NOT_FOUND)
        }
    }
        
    }
    @UseGuards(JwtAuthGuard)
    @UseFilters(new HttpExceptionFilter())
    @Put(':commentId')
    @HttpCode(204)
    async updateCommentByCommentId(@Param() params, @Body() content: Comment, @Req() req, @Res() res) {
        const result = await this.commentsService.updateCommentByCommentId(params.commentId, content.content, req.user!.id);
        if (result) {
            res.send('update done')
        }
        else if (result == null) {
            throw new HttpException('Comments NOT FOUND',HttpStatus.NOT_FOUND)
        }
        else {
            throw new HttpException('FORBIDDEN',HttpStatus.FORBIDDEN)
        }
    }
    @UseGuards(JwtAuthGuard)
    @Delete(':Id')
    @HttpCode(204)
    async deleteCommentById(@Param() params, @Req() req, @Res() res) {
        const resultDelete = await this.commentsService.deleteCommentByCommentId(params.Id, req.user!.id);
        console.log(resultDelete)
        if (resultDelete) {
            res.send('delete done')
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
    async like_dislike(@Param() params, @Body() likeStatus: LikesDTO, @Req() req) {
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
