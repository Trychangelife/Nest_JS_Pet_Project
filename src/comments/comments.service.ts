import { Injectable } from "@nestjs/common"
import { CommentsType } from "src/types/types"
import { CommentsRepository } from "./comments.repository"

@Injectable()
export class CommentsService {

    constructor(private commentsRepository: CommentsRepository) {
    }

    async getCommentsById(id: string): Promise<CommentsType | null> {
        return await this.commentsRepository.allCommentsByUserId(id)
    }
    async updateCommentByCommentId(commentId: string, content: string, userId: string): Promise<boolean | null> {
        return await this.commentsRepository.updateCommentByCommentId(commentId, content, userId)
    }
    async deleteCommentByCommentId(commentId: string, userId: string): Promise<boolean | null> {
        return await this.commentsRepository.deleteCommentByCommentId(commentId, userId)
    }
}