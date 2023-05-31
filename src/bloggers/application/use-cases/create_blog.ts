import { CommandHandler } from "@nestjs/cqrs"
import { BlogsType } from "src/bloggers/dto/BlogsType"
import { BlogsRepository } from "src/bloggers/repositories/bloggers.repository"
import { BlogsClass } from "src/utils/types"
import { v4 as uuidv4 } from "uuid"


export class CreateBlogCommand {
    constructor(public name: string, public websiteUrl: string, public description: string) {
        
    }
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase {
    constructor (protected bloggerRepository: BlogsRepository ) {}

    async execute(command: CreateBlogCommand): Promise<BlogsType | null> {
        // Построено на классе
        const newBlogs = new BlogsClass(uuidv4(), command.name, command.description, command.websiteUrl, (new Date()).toISOString(), false)
        const createdBlogs = await this.bloggerRepository.createBlogger(newBlogs)
        return createdBlogs
    }
}


