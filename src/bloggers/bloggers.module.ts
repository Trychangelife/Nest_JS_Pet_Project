import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { bloggerSchema } from "src/db";
import { BloggerController } from "./bloggers.controller";
import { BloggerRepository } from "./bloggers.repository";
import { BloggerService } from "./bloggers.service";




@Module({
    imports: [MongooseModule.forFeature([{name: 'Blogger', schema: bloggerSchema}, 
    //{name: 'Posts', schema: postSchema}, {name: 'Comments', schema: commentsSchema}, {name: 'Users', schema: usersSchema}, {name: 'RefreshToken', schema: refreshTokenSchema}
  ])],
    controllers: [BloggerController],
    providers: [BloggerRepository, BloggerService
      //, PostsService, PostRepository, JwtServiceClass, JwtService
    ]
  })
  export class BloggersModule {}