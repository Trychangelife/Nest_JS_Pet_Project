import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { commentsSchema } from "src/db";
import { CommentsController } from "./comments.controller";
import { CommentsRepository } from "./comments.repository";
import { CommentsService } from "./comments.service";

@Module({
    imports: [MongooseModule.forFeature([{name: 'Comments', schema: commentsSchema}])],
    controllers: [CommentsController],
    providers: [CommentsRepository, CommentsService],
  })
  export class CommentsModule {}