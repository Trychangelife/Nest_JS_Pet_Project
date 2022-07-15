import { UsersType } from "./Types";

declare global {
    namespace Express {
        export interface Request {
            user: UsersType | null
        }
    }
}