
export class BlogsClass {
    constructor(
        public id: string, 
        public name: string, 
        public description: string, 
        public websiteUrl: string, 
        public createdAt: string, 
        public isMembership: boolean,
        public blogOwnerInfo: {
            userId: string,
            userLogin: string
        }
        ) {
    }
}
