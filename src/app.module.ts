import 'dotenv/config'
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ServerApiVersion } from 'mongodb';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailerModule } from '@nest-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogsRepositorySql } from './bloggers/bloggers.sql.repository';
import { BlogsRepository } from './bloggers/bloggers.repository';
import { PostRepository } from './posts/posts.repository';
import { PostsRepositorySql } from './posts/posts.sql.repository';
import { BlogsController } from './bloggers/bloggers.controller';
import { PostController } from './posts/posts.controller';
import { BlogsService } from './bloggers/bloggers.service';
import { PostsService } from './posts/posts.service';
import { authDataSchema, blogsSchema, commentsSchema, postSchema, refreshTokenSchema, usersSchema, registrationDataSchema, emailSendSchema, codeConfirmSchema, recoveryPasswordSchema } from './db';
import { UsersService } from './users/users.service';
import { AuthService } from './auth/auth.service';
import { CommentsService } from './comments/comments.service';
import { AuthController } from './auth/auth.controller';
import { CommentsController } from './comments/comments.controller';
import { UsersController } from './users/users.controller';
import { EmailService } from './email/email.service';
import { JwtServiceClass } from './Auth_guards/jwt.service';
import { UsersRepository } from './users/users.repository';
import { CommentsRepository } from './comments/comments.repository';
import { EmailManager } from './email/email.manager';
import { EmailAdapter } from './email/email.adapter';
import { FullDataController } from './Full delete/full_delete.controller';
import { FullDeleteModule } from './Full delete/full_delete.module';
import { SecurityDeviceController } from './security_devices/security.controller';
import { SecurityDeviceService } from './security_devices/security.service';
import { SecurityDeviceRepository } from './security_devices/security.repository';


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
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: 5432,
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD, 
    database: process.env.POSTGRES_DATABASE_NAME,
    url: process.env.DATABASE_URL,
    autoLoadEntities: false,
    synchronize: true,
    ssl: true,
  }),
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env'
  }),
  MongooseModule.forRoot(uri, options),
  MongooseModule.forFeature([
    {name: 'Blogs', schema: blogsSchema}, 
    {name: 'Posts', schema: postSchema}, 
    {name: 'Comments', schema: commentsSchema}, 
    {name: 'Users', schema: usersSchema}, 
    {name: 'RefreshToken', schema: refreshTokenSchema},
    {name: 'RegistrationData', schema: registrationDataSchema}, 
    {name: 'AuthData', schema: authDataSchema},
    {name: 'CodeConfirm', schema: codeConfirmSchema},
    {name: 'EmailSend', schema: emailSendSchema},
    {name: 'RecoveryPassword', schema: recoveryPasswordSchema}
  ]),
  JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: {
        expiresIn: '24h'
    }
})],
  controllers: [AppController, BlogsController, PostController, UsersController, AuthController, CommentsController, FullDataController, SecurityDeviceController],
  providers: [AppService,
    BlogsService, 
    {provide: BlogsRepository, useClass: process.env.USE_DATABASE === 'SQL' ? BlogsRepositorySql : BlogsRepository}
    ,PostsService,
    {provide: PostRepository, useClass: process.env.USE_DATABASE === 'SQL' ? PostsRepositorySql: PostRepository},
    JwtServiceClass,
    UsersService, UsersRepository,
    AuthService,
    CommentsService, CommentsRepository,
    EmailService, EmailManager, EmailAdapter, FullDeleteModule, SecurityDeviceService, SecurityDeviceRepository
]
})
export class AppModule {}

