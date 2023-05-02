import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtServiceClass } from "src/Auth_guards/jwt.service";
import { SecurityDeviceController } from "./security.controller";
import { SecurityDeviceService } from "./security.service";
import { MongooseModule } from "@nestjs/mongoose";
import { refreshTokenSchema } from "src/db";
import { SecurityDeviceRepository } from "./security.repository";



@Module({
    imports: [
    // UsersModule, AuthModule, BlogsModule, 
    MongooseModule.forFeature([
    // {name: 'Posts', schema: postSchema},
    // {name: 'Blogs', schema: blogsSchema}, 
    // {name: 'Comments', schema: commentsSchema},
    {name: 'RefreshToken', schema: refreshTokenSchema},
    // {name: 'Users', schema: usersSchema}
])
],
    controllers: [SecurityDeviceController],
    providers: [JwtService, JwtServiceClass, SecurityDeviceService, SecurityDeviceRepository],
    exports: []
  })
  export class SecurityDeviceModule {}