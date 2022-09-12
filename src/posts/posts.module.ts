import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "src/auth/auth.module";
import { JwtServiceClass } from "src/Auth_guards/jwt.service";
import { BloggersModule } from "src/bloggers/bloggers.module";
import { BloggerRepository } from "src/bloggers/bloggers.repository";
import { BloggerService } from "src/bloggers/bloggers.service";
import { BloggerRepositorySql } from "src/bloggers/bloggers.sql.repository";
import { bloggerSchema, commentsSchema, postSchema, refreshTokenSchema, usersSchema } from "src/db";
import { UsersModule } from "src/users/users.module";
import { PostController } from "./posts.controller";
import { PostRepository } from "./posts.repository";
import { PostsService } from "./posts.service";



@Module({
    imports: [UsersModule, AuthModule, BloggersModule, MongooseModule.forFeature([
    //{name: 'Posts', schema: postSchema},
    //{name: 'Blogger', schema: bloggerSchema}, 
    //{name: 'Comments', schema: commentsSchema},
    //{name: 'RefreshToken', schema: refreshTokenSchema},
    //{name: 'Users', schema: usersSchema}
  ])],
    controllers: [PostController],
    providers: [PostRepository, PostsService, 
      //BloggerRepository,BloggerService, JwtService, JwtServiceClass
    ],
  })
  export class PostsModule {}