// import { Injectable } from "@nestjs/common";
// import { InjectModel } from "@nestjs/mongoose";
// import { BlogsType, PostsType } from "./types";
// import { Model } from "mongoose";

// @Injectable()
// export class BlogIdExistsValidator {
//   constructor(
//     @InjectModel('Blogs') protected bloggerModel: Model<BlogsType>
//   ) {}

//   async validate(value: string): Promise<boolean> {
//     // Проверяем наличие объекта в репозитории
//     const object = await this.bloggerModel.findOne({id: value}).lean(); // Используйте соответствующий метод для поиска объекта в вашей модели
//     console.log("what")
//     // Если объект не найден, генерируем ошибку
//     if (!object) {
//       return false;
//     }

//     return true;
//   }
// }

import { Injectable } from '@nestjs/common';
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { BlogsService } from 'src/bloggers/bloggers.service';


export function BlogIsExist(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: BlogIsExistRule,
    });
  };
}

@ValidatorConstraint({ name: 'BlogIsExist', async: false })
@Injectable()
export class BlogIsExistRule implements ValidatorConstraintInterface {
  constructor(private blogService: BlogsService) {}

  async validate(value: string) {
    try {
      const blog = await this.blogService.targetBloggers(value)
      if(blog) {
        return true
      } else return false
    } catch (e) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `Blog doesn't exist`;
  }
}



// import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
// import { BlogsClass, BlogsType } from './types';
// import { getModelForClass } from '@typegoose/typegoose';

// @ValidatorConstraint({ async: true })
// export class BlogIdExistsConstraint implements ValidatorConstraintInterface {
//   async validate(blogId: string): Promise<boolean> {
//     const bloggerModel = getModelForClass(BlogsClass);
//     const blog = await bloggerModel.findOne({ id: blogId }).lean().exec();
//     return !!blog;
//   }
// }

// export function BlogIdExists(validationOptions?: ValidationOptions) {
//   return function (object: Object, propertyName: string): void {
//     registerDecorator({
//       name: 'blogIdExists',
//       target: object.constructor,
//       propertyName: propertyName,
//       options: validationOptions,
//       constraints: [],
//       validator: BlogIdExistsConstraint,
//     });
//   };
// }