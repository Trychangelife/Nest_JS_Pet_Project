import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { blogsSchema, commentsSchema, postSchema, refreshTokenSchema, usersSchema } from "src/db";
import { BlogsController } from "./bloggers.controller";
import { BlogsRepository } from "./repositories/bloggers.repository";
import { BlogsService } from "./application/bloggers.service";
import { JwtService } from "@nestjs/jwt";
import { JwtServiceClass } from "src/guards/jwt.service";
import { PostRepository } from "src/posts/repositories/posts.repository";
import { PostsService } from "src/posts/application/posts.service";




@Module({
    imports: [MongooseModule.forFeature([{name: 'Blogs', schema: blogsSchema}, 
    {name: 'Posts', schema: postSchema}, {name: 'Comments', schema: commentsSchema}, {name: 'Users', schema: usersSchema}, {name: 'RefreshToken', schema: refreshTokenSchema}
  ])],
    controllers: [BlogsController],
    providers: [BlogsRepository, BlogsService, PostsService, PostRepository, JwtServiceClass, JwtService ]
  })
  export class BlogsModule {}