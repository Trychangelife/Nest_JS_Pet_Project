import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { commentsVievModel } from "src/posts/posts.repository"
import { CommentsType } from "src/types/types"

@Injectable()
export class CommentsRepository {

    constructor (
        @InjectModel('Comments') protected commentsModel: Model<CommentsType>
    ) {

    }

    async allCommentsByUserId(id: string): Promise<CommentsType | null> {
        const result = await this.commentsModel.findOne({ id: id }, commentsVievModel )
        if (result !== null) {
            return result
        }
        else {
            return null
        }
        
    }
    async updateCommentByCommentId(commentId: string, content: string, userId: string): Promise<boolean | null> {
        const findTargetComment = await this.commentsModel.findOne({ commentId: commentId }, commentsVievModel).lean()
        if (findTargetComment !== null && findTargetComment.userId === userId) {
            await this.commentsModel.updateOne({ commentId: commentId }, { $set: { content: content } })
            return true
        }
        if (findTargetComment == null) {
            return null
        }
        else {
            return false
        }
    }
    async deleteCommentByCommentId(commentId: string, userId: string): Promise<boolean | null> {
        const findTargetComment = await this.commentsModel.findOne({ id: commentId })
        if (findTargetComment !== null && findTargetComment.userId === userId) {
            await this.commentsModel.deleteOne({id: commentId})
            return true
        }
        if (findTargetComment == null) {
            return null
        }
        else {
            return false
        }
    }
}