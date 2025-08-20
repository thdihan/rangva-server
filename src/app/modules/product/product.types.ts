import { Prisma } from "../../../generated/prisma";

// Product creation type
export type CreateProductType = Prisma.ProductCreateInput;

// Product update type
export type UpdateProductType = Prisma.ProductUpdateInput;

// Product with relations
export type ProductWithRelations = Prisma.ProductGetPayload<{
    include: {
        category: {
            select: {
                id: true;
                name: true;
                image: true;
            };
        };
        tags: {
            include: {
                tag: true;
            };
        };
        productVariants: true;
        reviews: {
            where: { isApproved: true };
            select: {
                id: true;
                rating: true;
                title: true;
                comment: true;
                reviewerName: true;
                createdAt: true;
            };
        };
        _count: {
            select: {
                reviews: {
                    where: { isApproved: true };
                };
            };
        };
    };
}>;

// Product variant types
export type CreateProductVariantType = Prisma.ProductVariantCreateInput;
export type UpdateProductVariantType = Prisma.ProductVariantUpdateInput;

// Product review types
export type CreateProductReviewType = Prisma.ProductReviewCreateInput;
export type UpdateProductReviewType = Prisma.ProductReviewUpdateInput;

// Tag types
export type CreateTagType = Prisma.TagCreateInput;
export type UpdateTagType = Prisma.TagUpdateInput;

// Filter types
export interface IProductFilters {
    searchTerm?: string;
    categoryId?: string;
    status?: string;
    isActive?: boolean;
    isFeatured?: boolean;
    isDigital?: boolean;
    priceMin?: string;
    priceMax?: string;
    tags?: string[];
}

export interface IPaginationOptions {
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: string;
}

// API Response types
export interface IApiResponse<T> {
    status: number;
    success: boolean;
    message: string;
    meta?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    data: T;
}

export interface IProductListResponse {
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    data: ProductWithRelations[];
}
