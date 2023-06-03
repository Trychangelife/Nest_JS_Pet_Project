import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { constructorPagination } from "src/utils/pagination.constructor";
import { GetAllBlogsSuperAdminCommand } from "./application/get_all_blogs";
import { BasicAuthGuard } from "src/guards/basic_auth_guard";

@Controller('sa/blogs')
export class SuperAdminBlogsController {

    constructor(private commandBus: CommandBus) {
    }
    
    @UseGuards(BasicAuthGuard)
    @Get()
    async getAllBlogs(@Query() query: {searchNameTerm: string, pageNumber: string, pageSize: string, sortBy: string, sortDirection: string}) {
      const searchNameTerm = typeof query.searchNameTerm === 'string' ? query.searchNameTerm : null;
      const paginationData = constructorPagination(query.pageSize as string, query.pageNumber as string, query.sortBy as string, query.sortDirection as string);
      const allBlogsHowSuperAdmin: object = await this.commandBus.execute(new GetAllBlogsSuperAdminCommand(paginationData.pageSize, paginationData.pageNumber, searchNameTerm, paginationData.sortBy, paginationData.sortDirection));
      return allBlogsHowSuperAdmin
    }
}