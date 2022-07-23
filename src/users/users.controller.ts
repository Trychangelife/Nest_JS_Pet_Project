import { Injectable, Ip, Request } from "@nestjs/common";
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query } from "@nestjs/common";
import { constructorPagination } from "src/pagination.constructor";
import { UsersType } from "src/types/types";
import { UsersService } from "./users.service";



@Controller('users')
export class UsersController {

    constructor(protected usersService: UsersService) {
    }
    @Get()
    async getAllUsers(@Query() query: {SearchNameTerm: string, PageNumber: string, PageSize: string}) {
        const paginationData = constructorPagination(query.PageSize as string, query.PageNumber as string);
        const resultUsers = await this.usersService.allUsers(paginationData.pageSize, paginationData.pageNumber);
        return resultUsers
    }
    @Post()
    // Проверить, IP скорее всего не работает
    async createUser(@Body() user: {password: string, login: string, email: string},  @Request() req: {ip: string}) {
        const result: UsersType | boolean = await this.usersService.createUser(user.password, user.login, user.email, req.ip);
        if (result == false) {
          throw new HttpException("Login or email already use", HttpStatus.BAD_REQUEST)
        }
        else {
          return result
        }
    }
    @Delete(':id')
    async deleteUserById(@Param('id') id: string) {
        const afterDelete = await this.usersService.deleteUser(id as string);
        if (afterDelete == true) {
          throw new HttpException('User was deleted',HttpStatus.NO_CONTENT)
        }
        else {
          throw new HttpException('User NOT FOUND',HttpStatus.NOT_FOUND)
        }

    }
    @Get(':id')
    async getUserById(@Param(':id') id: string ) {
        const resultSearch = await this.usersService.findUserById(id);
        if (resultSearch !== null) {
            return resultSearch
        }
        else {
          throw new HttpException('User NOT FOUND',HttpStatus.NOT_FOUND)
        }
    }
}