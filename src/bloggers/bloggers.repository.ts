import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { BloggersType } from "src/types/types"

const modelViewBloggers = {
    _id: 0,
    id: 1,
    name: 1,
    youtubeUrl: 1
}

@Injectable()
export class BloggerRepository {

    constructor(@InjectModel('Blogger') protected bloggerModel: Model<BloggersType>) {
        
    }

    async allBloggers(skip: number, limit?: number, searchNameTerm?: string | null, page?: number): Promise<object> {
        if (page !== undefined && limit !== undefined) {
            const cursor = await this.bloggerModel.find({}, modelViewBloggers).skip(skip).limit(limit)
            const totalCount = await this.bloggerModel.count({})
            const pagesCount = Math.ceil(totalCount / limit)
            const fullData = await this.bloggerModel.find({}, modelViewBloggers)

            if (searchNameTerm !== null) {
                const cursorWithRegEx = await this.bloggerModel.find({ name: { $regex: searchNameTerm, $options: 'i' } }, modelViewBloggers).skip(skip).limit(limit)
                const totalCountWithRegex = cursorWithRegEx.length
                const pagesCountWithRegex = Math.ceil(totalCountWithRegex / limit)
                return { pagesCount: pagesCountWithRegex, page: page, pageSize: limit, totalCount: totalCountWithRegex, items: cursorWithRegEx }
            }
            if (skip > 0 || limit > 0) {
                return { pagesCount, page: page, pageSize: limit, totalCount, items: cursor }
            }
            else return { pagesCount: 0, page: page, pageSize: limit, totalCount, items: fullData }
        }
        else {
            return await this.bloggerModel.find({}, modelViewBloggers)
        }

    }
    async targetBloggers(id: string): Promise<object | undefined> {
        const blogger: BloggersType | null = await this.bloggerModel.findOne({ id: id }, modelViewBloggers)
        if (blogger !== null) {
            return blogger
        }
        else {
            return
        }
    }
    async createBlogger(newBlogger: BloggersType): Promise<BloggersType | null> {
        await this.bloggerModel.create(newBlogger)
        return await this.bloggerModel.findOne({ id: newBlogger.id }, modelViewBloggers)
    }
    async changeBlogger(id: string, name: any, youtubeUrl: string): Promise<boolean> {
        const result = await this.bloggerModel.updateOne({ id: id }, { $set: { name: name, youtubeUrl: youtubeUrl } })
        return result.matchedCount === 1
    }
    async deleteBlogger(id: string): Promise<boolean> {
        const result = await this.bloggerModel.deleteOne({ id: id })
        return result.deletedCount === 1
    }
    async deleteAllBlogger(): Promise<boolean> {
        const afterDelete = await this.bloggerModel.deleteMany({})
        return afterDelete.acknowledged
    }
}