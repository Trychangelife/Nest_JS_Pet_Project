import { CommandHandler } from "@nestjs/cqrs"
import { BlogsRepository } from "src/bloggers/repositories/bloggers.repository"


export class GetAllBlogsCommand {
    constructor(public pageSize: number, public pageNumber: number, public searchNameTerm?: string | null, public sortBy?: string, public sortDirection?: string) {
        
    }
}

@CommandHandler(GetAllBlogsCommand)
export class GetAllBlogsUseCase {
    constructor (protected bloggerRepository: BlogsRepository ) {}

    async execute(command: GetAllBlogsCommand): Promise<object> {
        let skip = 0
        if (command.pageNumber && command.pageSize) {
            skip = (command.pageNumber - 1) * command.pageSize
        }
        const bloggers = await this.bloggerRepository.getAllBlogs(skip, command.pageSize, command.searchNameTerm, command.pageNumber, command.sortBy, command.sortDirection)
        return bloggers
    }
}


