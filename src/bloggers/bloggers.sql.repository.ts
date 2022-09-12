import { Injectable } from "@nestjs/common"
import { InjectDataSource } from "@nestjs/typeorm"
import { BloggersType } from "src/types/types"
import { DataSource } from "typeorm"


@Injectable()
export class BloggerRepositorySql {

    constructor(@InjectDataSource() protected dataSource: DataSource) {
        
    }

    async allBloggers(skip: number, limit?: number, searchNameTerm?: string | null, page?: number): Promise<object> {
        const totalCount = await this.dataSource.query(`SELECT COUNT(*) FROM "Bloggers"`)
        const keys = Object.keys(totalCount)
        const pagesCount = Math.ceil(totalCount[keys[0]].count / limit)
        if (searchNameTerm !== null) {
            const getAllBloggers = await this.dataSource.query(
                `
                SELECT * 
                FROM "Bloggers"
                WHERE name LIKE '${'%'+ searchNameTerm + '%'}'
                ORDER BY id
                LIMIT $1 OFFSET $2
                `
            , [limit, skip])
            return { pagesCount, page: page, pageSize: limit, totalCount: parseInt(totalCount[keys[0]].count) , items: getAllBloggers }
        }
        else {
        const getAllBloggers = await this.dataSource.query(
            `
            SELECT * 
            FROM "Bloggers"
            ORDER BY id
            LIMIT $1 OFFSET $2
            `
        , [limit, skip])
        return { pagesCount, page: page, pageSize: limit, totalCount: parseInt(totalCount[keys[0]].count) , items: getAllBloggers }
    }
        // if (page !== undefined && limit !== undefined) {
        //     const cursor = await this.bloggerModel.find({}, modelViewBloggers).skip(skip).limit(limit)
        //     const totalCount = await this.bloggerModel.count({})
        //     const pagesCount = Math.ceil(totalCount / limit)
        //     const fullData = await this.bloggerModel.find({}, modelViewBloggers)

        //     if (searchNameTerm !== null) {
        //         const cursorWithRegEx = await this.bloggerModel.find({ name: { $regex: searchNameTerm, $options: 'i' } }, modelViewBloggers).skip(skip).limit(limit)
        //         const totalCountWithRegex = cursorWithRegEx.length
        //         const pagesCountWithRegex = Math.ceil(totalCountWithRegex / limit)
        //         return { pagesCount: pagesCountWithRegex, page: page, pageSize: limit, totalCount: totalCountWithRegex, items: cursorWithRegEx }
        //     }
        //     if (skip > 0 || limit > 0) {
        //         return { pagesCount, page: page, pageSize: limit, totalCount, items: cursor }
        //     }
        //     else return { pagesCount: 0, page: page, pageSize: limit, totalCount, items: fullData }
        // }
        // else {
        //     return await this.bloggerModel.find({}, modelViewBloggers)
        // }

    }
    async targetBloggers(id: string): Promise<object | undefined> {

        const blogger = await this.dataSource.query(
            `
        SELECT * 
        FROM "Bloggers" WHERE id = $1
            `, [id])
        if (blogger !== null) {
            return blogger
        }
        else {
            return
        }
    }
    async createBlogger(newBlogger: BloggersType): Promise<BloggersType | null> {
        await this.dataSource.query(`
        INSERT INTO "Bloggers" (name, "youtubeUrl")
        VALUES ($1, $2)
        `, [newBlogger.name, newBlogger.youtubeUrl])
        const bloggerAfterCreate = await this.dataSource.query(`
        SELECT *
        FROM "Bloggers"
        WHERE name = $1
        `,[newBlogger.name])
        return bloggerAfterCreate
    }
    // async changeBlogger(id: string, name: any, youtubeUrl: string): Promise<boolean> {
    //     const result = await this.bloggerModel.updateOne({ id: id }, { $set: { name: name, youtubeUrl: youtubeUrl } })
    //     return result.matchedCount === 1
    // }
    async deleteBlogger(id: string): Promise<boolean> {
        const result = await this.dataSource.query(`
        DELETE FROM "Bloggers"
        WHERE id = $1
        `, [id])
        //УДАЛЕНИЕ ПРОИСХОДИТ, но ошибка 404 падает. (НУЖНО РАЗОБРАТЬСЯ)
        return result
    }
    // async deleteAllBlogger(): Promise<boolean> {
    //     const afterDelete = await this.bloggerModel.deleteMany({})
    //     return afterDelete.acknowledged
    // }
}