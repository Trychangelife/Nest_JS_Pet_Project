import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "src/auth/auth.module";
import { BloggersModule } from "src/bloggers/bloggers.module";
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