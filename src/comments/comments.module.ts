import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { commentsSchema } from "src/db";
import { UsersModule } from "src/users/users.module";
import { CommentsController } from "./comments.controller";
import { CommentsRepository } from "./comments.repository";
import { CommentsService } from "./comments.service";

@Module({
    imports: [UsersModule ,MongooseModule.forFeature([{name: 'Comments', schema: commentsSchema}, 
    //{name: 'RefreshToken', schema: refreshTokenSchema}, {name: 'Users', schema: usersSchema}
  ])],
    controllers: [CommentsController],
    providers: [CommentsRepository, CommentsService, 
      //JwtServiceClass, JwtAuthGuard, JwtService, UsersModule
    ],
  })
  export class CommentsModule {}