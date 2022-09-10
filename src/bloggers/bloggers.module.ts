import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtServiceClass } from "src/Auth_guards/jwt.service";
import { bloggerSchema, commentsSchema, postSchema, refreshTokenSchema, usersSchema } from "src/db";
import { PostRepository } from "src/posts/posts.repository";
import { PostsService } from "src/posts/posts.service";
import { BloggerController } from "./bloggers.controller";
import { BloggerRepository } from "./bloggers.repository";
import { BloggerRepositorySql } from "./bloggers.sql.repository";
import { BloggerService } from "./bloggers.service";




@Module({
    imports: [MongooseModule.forFeature([{name: 'Blogger', schema: bloggerSchema}, {name: 'Posts', schema: postSchema}, {name: 'Comments', schema: commentsSchema}, {name: 'Users', schema: usersSchema}, {name: 'RefreshToken', schema: refreshTokenSchema}])],
    controllers: [BloggerController],
    providers: [BloggerRepository, BloggerRepositorySql ,BloggerService, PostsService, PostRepository, JwtServiceClass, JwtService],
  })
  export class BloggersModule {}