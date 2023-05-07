import { BadRequestException, Injectable, Ip, Request, UseFilters, UseGuards } from "@nestjs/common";
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query } from "@nestjs/common";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";
import { constructorPagination } from "../pagination.constructor";
import { UsersType } from "../types/types";
import { UsersService } from "./users.service";
import { HttpExceptionFilter } from "../exception_filters/exception_filter";
import { UserRegistrationFlow } from "../guard/users.registration.guard";
import { AuthForm } from "../types/class-validator.form";

class CreateUser {
  @IsEmail()
  email: string
  @MinLength(5)
  @MaxLength(10)
  login: string
  @MinLength(3)
  password: string
}

@Controller('users')
export class UsersController {

    constructor(protected usersService: UsersService) {
    }

    
    @Get()
    async getAllUsers(@Query() query: {SearchNameTerm: string, PageNumber: string, PageSize: string, sortBy: string, sortDirection: string}) {
        const paginationData = constructorPagination(query.PageSize as string, query.PageNumber as string, query.sortBy as string, query.sortDirection as string);
        const resultUsers = await this.usersService.allUsers(paginationData.pageSize, paginationData.pageNumber);
        return resultUsers
    }
    @Post()
    @UseGuards(UserRegistrationFlow)
    @UseFilters(new HttpExceptionFilter())
    // Проверить, IP скорее всего не работает
    async createUser(@Body() user: AuthForm,  @Request() req: {ip: string}) {
        const result: UsersType | boolean = await this.usersService.createUser(user.password, user.login, user.email, req.ip);
        if (result == false) {
          throw new BadRequestException([{message: 'Bad email', field: 'Email'}])
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