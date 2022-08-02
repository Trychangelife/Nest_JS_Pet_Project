import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { bloggerSchema, commentsSchema, postSchema, usersSchema } from "src/db";
import { PostRepository } from "src/posts/posts.repository";
import { PostsService } from "src/posts/posts.service";
import { BloggerController } from "./bloggers.controller";
import { BloggerRepository } from "./bloggers.repository";
import { BloggerService } from "./bloggers.service";



@Module({
    imports: [MongooseModule.forFeature([{name: 'Blogger', schema: bloggerSchema}, {name: 'Posts', schema: postSchema}, {name: 'Comments', schema: commentsSchema}, {name: 'Users', schema: usersSchema}])],
    controllers: [BloggerController],
    providers: [BloggerRepository, BloggerService, PostsService, PostRepository],
  })
  export class BloggersModule {}