export type BloggersType = {
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: string;
    isMembership: boolean;
    blogOwnerInfo: {
        userId: string,
        userLogin: string
    }

};
