import { Controller, Injectable } from "@nestjs/common";
import { CommentsService } from "./comments.service";

@Controller('comments')
export class CommentsController {

    constructor(private commentsService: CommentsService) {
    }

    // async getCommentById(req: Request, res: Response) {
    //     const result = await this.commentsService.getCommentsById(req.params.id);
    //     if (result !== null) {
    //         res.status(200).send(result);
    //     }
    //     else {
    //         res.send(404);
    //     }
    // }
    // async updateCommentByCommentId(req: Request, res: Response) {
    //     const result = await this.commentsService.updateCommentByCommentId(req.params.commentId, req.body.content, req.user!.id);
    //     if (result) {
    //         res.send(204);
    //     }
    //     else if (result == null) {
    //         res.send(404);
    //     }
    //     else {
    //         res.send(403);
    //     }
    // }
    // async deleteCommentById(req: Request, res: Response) {
    //     const resultDelete = await this.commentsService.deleteCommentByCommentId(req.params.commentId, req.user!.id);
    //     if (resultDelete) {
    //         res.send(204);
    //     }
    //     else if (resultDelete == null) {
    //         res.send(404);
    //     }
    //     else {
    //         res.send(403);
    //     }
    // }
}
