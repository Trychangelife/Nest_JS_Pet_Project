import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, Put, Query, Req, Res, UseFilters, UseGuards } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { JwtServiceClass } from "../guards/jwt.service";
import { PostsService } from "../posts/application/posts.service";
import { BlogsService } from "./application/bloggers.service";
import { BasicAuthGuard } from "../guards/basic_auth_guard";
import { constructorPagination } from "../utils/pagination.constructor";
import { BlogsType, PostsType } from "../utils/types";
import { Blogs, PostTypeValidator } from "src/utils/class-validator.form";
import { HttpExceptionFilter } from "src/exception_filters/exception_filter";

@Controller('blogs')
export class BlogsController {
    
    constructor(
      protected blogsService: BlogsService, 
      protected postsService: PostsService,
      protected jwtServiceClass: JwtServiceClass,

      @InjectModel('Blogs') protected blogsModel: Model<BlogsType>) {
    }

    // @Delete('/del')
    // async deleteAllBlogs() {
    //   const afterDelete = await this.blogsService.deleteAllBlogs();
    //   if (afterDelete) {
    //     return HttpStatus.OK
    //   }
    //   else {
    //     return HttpStatus.BAD_REQUEST
    //   }
    // }

    @Get()
    async getAllBloggers(@Query() query: {searchNameTerm: string, pageNumber: string, pageSize: string, sortBy: string, sortDirection: string}) {
      const searchNameTerm = typeof query.searchNameTerm === 'string' ? query.searchNameTerm : null;
      const paginationData = constructorPagination(query.pageSize as string, query.pageNumber as string, query.sortBy as string, query.sortDirection as string);
      const full: object = await this.blogsService.allBloggers(paginationData.pageSize, paginationData.pageNumber, searchNameTerm, paginationData.sortBy, paginationData.sortDirection);
      return full
    }

    @Get(':id')
    async getBloggerById(@Param('id') id: string) {
      const findBlogger: object | undefined = await this.blogsService.targetBloggers(id);
        if (findBlogger !== undefined) {
            return findBlogger
        }
        else {
            throw new HttpException('Blog not found',HttpStatus.NOT_FOUND)
        }
    }

    @Get(':bloggerId/posts')
    async getPostByBloggerID(@Query() query: {SearchNameTerm: string, PageNumber: string, PageSize: string, sortBy: string, sortDirection: string}, @Param() params, @Req() req) {
      try {
        const token = req.headers.authorization.split(' ')[1]
        const userId = await this.jwtServiceClass.getUserByAccessToken(token)
        const paginationData = constructorPagination(query.PageSize as string, query.PageNumber as string, query.sortBy as string, query.sortDirection as string);
        const findBlogger: object | undefined = await this.postsService.allPostsSpecificBlogger(params.bloggerId, paginationData.pageNumber, paginationData.pageSize, userId);
       if (findBlogger !== undefined) {
        return findBlogger
      }
        else {
        throw new HttpException('Post NOT FOUND',HttpStatus.NOT_FOUND)
      }
      } catch (error) {
        const paginationData = constructorPagination(query.PageSize as string, query.PageNumber as string, query.sortBy as string, query.sortDirection as string);
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
    @UseFilters(new HttpExceptionFilter())
    @Post()
    async createBlogger(@Body() bloggersType: Blogs) {
  
      const createrPerson: BlogsType | null = await this.blogsService.createBlogger(bloggersType.name, bloggersType.websiteUrl, bloggersType.description );
      if (createrPerson !== null) {
        return createrPerson
      }
      else { 
        throw new HttpException('Opps check input Data',HttpStatus.BAD_REQUEST)
      }
    }
    @UseGuards(BasicAuthGuard)
    @UseFilters(new HttpExceptionFilter())
    @Post(':id/posts')
    async createPostByBloggerId(@Param() params, @Body() post: PostTypeValidator) {
      const blogger = await this.blogsModel.count({ id: params.id }); 
      if (blogger < 1) { throw new HttpException('Blogger NOT FOUND',HttpStatus.NOT_FOUND) }
  
      const createPostForSpecificBlogger: string | object | null = await this.postsService.releasePost(post.title, post.content, post.shortDescription, post.blogId, params.id);
      return createPostForSpecificBlogger;
  
    }
    @UseGuards(BasicAuthGuard)
    @UseFilters(new HttpExceptionFilter())
    @Put(':id')
    async updateBlogger(@Param() params, @Body() bloggersType: Blogs) {
      const alreadyChanges: string = await this.blogsService.changeBlogs(params.id, bloggersType.name, bloggersType.websiteUrl);
      if (alreadyChanges === 'update') {
        throw new HttpException('Update succefully', HttpStatus.NO_CONTENT)
      }
      else if (alreadyChanges === "404") {
        throw new HttpException('Blogger NOT FOUND',HttpStatus.NOT_FOUND)
      }
    }
    @UseGuards(BasicAuthGuard)
    @Delete(':id')
    async deleteOneBlogger(@Param() params) {
      const afterDelete = await this.blogsService.deleteBlogger(params.id);
      if (afterDelete === "204") {
        throw new HttpException('Delete succefully',HttpStatus.NO_CONTENT)
      }
      else {
        throw new HttpException('Blogger NOT FOUND',HttpStatus.NOT_FOUND)
      }
    }
  }