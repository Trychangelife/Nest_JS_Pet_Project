import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { commentsSchema, refreshTokenSchema, usersSchema } from "src/db";
import { JwtAuthGuard } from "src/Auth_guards/jwt-auth.guard";
import { JwtServiceClass } from "src/Auth_guards/jwt.service";
import { UsersModule } from "src/users/users.module";
import { CommentsController } from "./comments.controller";
import { CommentsRepository } from "./comments.repository";
import { CommentsService } from "./comments.service";

@Module({
    imports: [UsersModule ,MongooseModule.forFeature([{name: 'Comments', schema: commentsSchema}, {name: 'RefreshToken', schema: refreshTokenSchema}, {name: 'Users', schema: usersSchema}])],
    controllers: [CommentsController],
    providers: [CommentsRepository, CommentsService, JwtServiceClass, JwtAuthGuard, JwtService, UsersModule],
  })
  export class CommentsModule {}