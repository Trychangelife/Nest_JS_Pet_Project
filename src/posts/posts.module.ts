import { Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "src/auth/auth.module";
import { BloggersModule } from "src/bloggers/bloggers.module";
import { BloggerRepository } from "src/bloggers/bloggers.repository";
import { BloggerService } from "src/bloggers/bloggers.service";
import { bloggerSchema, commentsSchema, postSchema, refreshTokenSchema } from "src/db";
import { JwtAuthGuard } from "src/Auth_guards/jwt-auth.guard";
import { JwtServiceClass } from "src/Auth_guards/jwt.service";
import { UsersModule } from "src/users/users.module";
import { PostController } from "./posts.controller";
import { PostRepository } from "./posts.repository";
import { PostsService } from "./posts.service";



@Module({
    imports: [UsersModule, AuthModule, BloggersModule, MongooseModule.forFeature([
    {name: 'Posts', schema: postSchema},
    {name: 'Blogger', schema: bloggerSchema}, 
    {name: 'Comments', schema: commentsSchema},
    {name: 'RefreshToken', schema: refreshTokenSchema}])],
    controllers: [PostController],
    providers: [PostRepository, PostsService, BloggerRepository, BloggerService, JwtService],
  })
  export class PostsModule {}