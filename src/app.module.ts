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
import { MailerModule } from '@nest-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';


const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
};
const uri:string = process.env.mongoURI

@Module({
  imports: [
  MailerModule.forRootAsync({
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
  }), 
  ConfigModule.forRoot(),
  BloggersModule,
  PostsModule,
  CommentsModule, 
  UsersModule, 
  AuthModule , 
  FullDeleteModule,
  MongooseModule.forRoot(uri, options),
  JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: {
        expiresIn: '24h'
    }
})],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
