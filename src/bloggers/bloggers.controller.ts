import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, Put, Query, Req, Res, UseGuards } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BasicAuthGuard } from "src/Auth_guards/basic_auth_guard";
import { JwtServiceClass } from "src/Auth_guards/jwt.service";
import { constructorPagination } from "src/pagination.constructor";
import { PostsService } from "src/posts/posts.service";
import { BloggersType, PostsType } from "src/types/types";
import { BloggerService } from "./bloggers.service";

@Controller('bloggers')
export class BloggerController {
    
    constructor(
      protected bloggerService: BloggerService, 
      protected postsService: PostsService,
      protected jwtServiceClass: JwtServiceClass,
      @InjectModel('Blogger') protected bloggerModel: Model<BloggersType>) {
    }

    @Delete('/del')
    async deleteAllBlogger() {
      const afterDelete = await this.bloggerService.deleteAllBlogger();
      if (afterDelete) {
        return HttpStatus.OK
      }
      else {
        return HttpStatus.BAD_REQUEST
      }
    }

    @Get()
    async getAllBloggers(@Query() query: {SearchNameTerm: string, PageNumber: string, PageSize: string}) {
      const searchNameTerm = typeof query.SearchNameTerm === 'string' ? query.SearchNameTerm : null;
      const paginationData = constructorPagination(query.PageSize as string, query.PageNumber as string);
      const full: object = await this.bloggerService.allBloggers(paginationData.pageSize, paginationData.pageNumber, searchNameTerm);
      return full
    }

    @Get(':id')
    async getBloggerById(@Param('id') id: string) {
      const findBlogger: object | undefined = await this.bloggerService.targetBloggers(id);
        if (findBlogger !== undefined) {
            return findBlogger
        }
        else {
            throw new HttpException('Opps check input params',HttpStatus.BAD_REQUEST)
        }
    }

    @Get(':bloggerId/posts')
    async getPostByBloggerID(@Query() query: {SearchNameTerm: string, PageNumber: string, PageSize: string}, @Param() params, @Req() req) {
      try {
        const token = req.headers.authorization.split(' ')[1]
        const userId = await this.jwtServiceClass.getUserByToken(token)
        const paginationData = constructorPagination(query.PageSize as string, query.PageNumber as string);
        const findBlogger: object | undefined = await this.postsService.allPostsSpecificBlogger(params.bloggerId, paginationData.pageNumber, paginationData.pageSize, userId);
       if (findBlogger !== undefined) {
        return findBlogger
      }
        else {
        throw new HttpException('Post NOT FOUND',HttpStatus.NOT_FOUND)
      }
      } catch (error) {
        const paginationData = constructorPagination(query.PageSize as string, query.PageNumber as string);
      const findBlogger: object | undefined = await this.postsService.allPostsSpecificBlogger(params.bloggerId, paginationData.pageNumber, paginationData.pageSize);
      if (findBlogger !== undefined) {
        return findBlogger
      }
      else {
        throw new HttpException('Post NOT FOUND',HttpStatus.NOT_FOUND)
      }
      }
      
    }
    @UseGuards(BasicAuthGuard)
    @Post()
    async createBlogger(@Body() bloggersType: BloggersType) {
  
      const createrPerson: BloggersType | null = await this.bloggerService.createBlogger(bloggersType.name, bloggersType.youtubeUrl);
      if (createrPerson !== null) {
        return createrPerson
      }
      else { 
        throw new HttpException('Opps check input Data',HttpStatus.BAD_REQUEST)
      }
    }
  
    @Post(':id/posts')
    async createPostByBloggerId(@Param() params, @Body() post: PostsType) {
      const blogger = await this.bloggerModel.count({ id: params.id }); 
      if (blogger < 1) { throw new HttpException('Blogger NOT FOUND',HttpStatus.NOT_FOUND) }
  
      const createPostForSpecificBlogger: string | object | null = await this.postsService.releasePost(post.title, post.content, post.shortDescription, post.bloggerId, params.id);
      return createPostForSpecificBlogger;
  
    }

    @Put(':id')
    async updateBlogger(@Param() params, @Body() bloggersType: BloggersType) {
      const alreadyChanges: string = await this.bloggerService.changeBlogger(params.id, bloggersType.name, bloggersType.youtubeUrl);
      if (alreadyChanges === 'update') {
        throw new HttpException('Update succefully', HttpStatus.NO_CONTENT)
      }
      else if (alreadyChanges === "404") {
        throw new HttpException('Blogger NOT FOUND',HttpStatus.NOT_FOUND)
      }
    }

    @Delete(':id')
    async deleteOneBlogger(@Param() params) {
      const afterDelete = await this.bloggerService.deleteBlogger(params.id);
      if (afterDelete === "204") {
        throw new HttpException('Delete succefully',HttpStatus.NO_CONTENT)
      }
      else {
        throw new HttpException('Blogger NOT FOUND',HttpStatus.NOT_FOUND)
      }
    }
  }