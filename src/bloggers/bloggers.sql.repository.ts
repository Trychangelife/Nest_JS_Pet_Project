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
        const bloggerAfterCreate = await this.dataSource.query(`
        INSERT INTO "Bloggers" (name, "youtubeUrl")
        VALUES ($1, $2)
        RETURNING *
        `, [newBlogger.name, newBlogger.youtubeUrl])
        return bloggerAfterCreate
    }
    async changeBlogger(id: string, name: any, youtubeUrl: string): Promise<boolean> {

        const update = await this.dataSource.query(`
        UPDATE "Bloggers"
        SET name = $2, "youtubeUrl" = $3
        WHERE id = $1
        RETURNING *
        `,[id, name,youtubeUrl])

        if (update[0][0].name === name && update[0][0].youtubeUrl === youtubeUrl) {
            return true
        }
        else {
            return false
        }
        
    }
    async deleteBlogger(id: string): Promise<boolean> {
        const findUserAfterDelete = await this.dataSource.query(`SELECT id, name, "youtubeUrl" FROM "Bloggers" WHERE id = $1`,[id])
        if (findUserAfterDelete.length < 1) {
            return false
        }
        else {
            await this.dataSource.query(`DELETE FROM "Bloggers" WHERE id = $1`, [id])
            return true
        }
    }
    async deleteAllBlogger(): Promise<boolean> {
        await this.dataSource.query(`TRUNCATE TABLE "Bloggers"`)
        const checkTableAfterFullClear = await this.dataSource.query(`SELECT COUNT(*) FROM "Bloggers"`)
        if (checkTableAfterFullClear > 1) {
            return false
        }
        else {
            return true
        }
        
    }
}