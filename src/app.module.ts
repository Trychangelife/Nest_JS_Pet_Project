import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServerApiVersion } from 'mongodb';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BloggersModule } from './bloggers/bloggers.module';
import { CommentsModule } from './comments/comments.module';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import 'dotenv/config'
import { AuthModule } from './auth/auth.module';
import { FullDeleteModule } from './Full delete/full_delete.module';


const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
};
const uri:string = process.env.mongoURI

@Module({
  imports: [BloggersModule,PostsModule,CommentsModule, UsersModule, AuthModule , FullDeleteModule,MongooseModule.forRoot(uri, options)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
