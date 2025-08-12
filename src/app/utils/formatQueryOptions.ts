export type TQueryOptions = {
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: string;
};

type TQueryOptionsResult = {
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: string;
};

export const paginationOptions = ["page", "limit", "sortBy", "sortOrder"];
export const formatQueryOptions = (
    options: TQueryOptions
): TQueryOptionsResult => {
    const page: number = Number(options.page) || 0;
    const skip: number =
        (Number(options.page) - 1) * Number(options.limit) || 0;
    const limit: number = Number(options.limit) || 10;
    const sortBy: string = options.sortBy || "createdAt";
    const sortOrder: string = options.sortOrder || "desc";

    return {
        page,
        skip,
        limit,
        sortBy,
        sortOrder,
    };
};
