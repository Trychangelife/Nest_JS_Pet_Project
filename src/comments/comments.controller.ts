import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Put, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/Auth_guards/jwt-auth.guard";
import { CommentsType } from "src/types/types";
import { CommentsService } from "./comments.service";

@Controller('comments')
export class CommentsController {

    constructor(protected commentsService: CommentsService) {
    }
    @Get(':id')
    async getCommentById(@Param('id') params) {
        const result = await this.commentsService.getCommentsById(params.id);
        if (result !== null) {
            return HttpStatus.NO_CONTENT
        }
        else {
            throw new HttpException('Comments NOT FOUND',HttpStatus.NOT_FOUND)
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
}
