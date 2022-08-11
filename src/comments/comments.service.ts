import { Injectable } from "@nestjs/common"
import { CommentsType, LIKES } from "src/types/types"
import { LikesDTO } from "./comments.controller"
import { CommentsRepository } from "./comments.repository"

@Injectable()
export class CommentsService {

    constructor(protected commentsRepository: CommentsRepository) {
    }

    async getCommentsById(id: string, userId?: string): Promise<CommentsType | null> {
        return await this.commentsRepository.commentsByUserId(id, userId)
    }
    async updateCommentByCommentId(commentId: string, content: string, userId: string): Promise<boolean | null> {
        return await this.commentsRepository.updateCommentByCommentId(commentId, content, userId)
    }
    async deleteCommentByCommentId(commentId: string, userId: string): Promise<boolean | null> {
        return await this.commentsRepository.deleteCommentByCommentId(commentId, userId)
    }
    async like_dislike (commmentId: string, likeStatus: LikesDTO, userId: string, login: string): Promise<string | object> {
        return await this.commentsRepository.like_dislike(commmentId, likeStatus, userId, login)
    }
}