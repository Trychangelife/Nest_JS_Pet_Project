import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BloggersModule } from "src/bloggers/bloggers.module";
import { BloggerRepository } from "src/bloggers/bloggers.repository";
import { BloggerService } from "src/bloggers/bloggers.service";
import { bloggerSchema, commentsSchema, postSchema } from "src/db";
import { PostController } from "./posts.controller";
import { PostRepository } from "./posts.repository";
import { PostsService } from "./posts.service";



@Module({
    imports: [BloggersModule, MongooseModule.forFeature([
    {name: 'Posts', schema: postSchema},
    {name: 'Blogger', schema: bloggerSchema}, 
    {name: 'Comments', schema: commentsSchema}])],
    controllers: [PostController],
    providers: [PostRepository, PostsService, BloggerRepository, BloggerService],
  })
  export class PostsModule {}