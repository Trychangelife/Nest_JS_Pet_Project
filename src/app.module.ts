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
import nodemailer from "nodemailer"
import { MailerModule } from '@nest-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

// let transport = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: "jenbka999@gmail.com",
//     pass: process.env.PASSWORD_GMAIL
//   },
// })

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
};
const uri:string = process.env.mongoURI

@Module({
  imports: [MailerModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (config: ConfigService) => ({
      transport: {
        host: config.get('EMAIL_HOST'),
        secure: false,
        port: 587,
        auth: {
               user: config.get('EMAIL_USER'),
               pass: config.get('PASSWORD_GMAIL')
            },
      },
    }), inject: [ConfigService]
  }), ConfigModule.forRoot(),BloggersModule,PostsModule,CommentsModule, UsersModule, AuthModule , FullDeleteModule,MongooseModule.forRoot(uri, options)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
