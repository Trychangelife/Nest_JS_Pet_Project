import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "src/auth/auth.module";
import { BlogsModule } from "src/bloggers/bloggers.module";
import { UsersModule } from "src/users/users.module";
import { PostController } from "./posts.controller";
import { PostRepository } from "./posts.repository";
import { PostsService } from "./posts.service";
import { JwtService } from "@nestjs/jwt";
import { JwtServiceClass } from "src/Auth_guards/jwt.service";
import { BlogsRepository } from "src/bloggers/bloggers.repository";
import { BlogsService } from "src/bloggers/bloggers.service";
import { postSchema, blogsSchema, commentsSchema, refreshTokenSchema, usersSchema } from "src/db";



@Module({
    imports: [UsersModule, AuthModule, BlogsModule, MongooseModule.forFeature([
    {name: 'Posts', schema: postSchema},
    {name: 'Blogs', schema: blogsSchema}, 
    {name: 'Comments', schema: commentsSchema},
    {name: 'RefreshToken', schema: refreshTokenSchema},
    {name: 'Users', schema: usersSchema}
  ])],
    controllers: [PostController],
    providers: [PostRepository, PostsService, 
    BlogsRepository,BlogsService, JwtService, JwtServiceClass
    ],
  })
  export class PostsModule {}