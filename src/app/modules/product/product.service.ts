import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { formatQueryOptions } from "../../utils/formatQueryOptions";
import { Prisma } from "../../../generated/prisma";
import prisma from "../../utils/prisma";
import { productSearchableFields } from "./product.constant";

interface IPaginationOptions {
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: string;
}

interface IProductFilterRequest {
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

// Helper function to generate slug
const generateSlug = (name: string): string => {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
};

// Create a new product
const createProduct = async (payload: any) => {
    // Generate slug if not provided
    if (!payload.slug) {
        payload.slug = generateSlug(payload.name);
    }

    // Ensure slug is unique
    const existingProduct = await prisma.product.findUnique({
        where: { slug: payload.slug },
    });

    if (existingProduct) {
        payload.slug = `${payload.slug}-${Date.now()}`;
    }

    // Set publishedAt if status is PUBLISHED
    if (payload.status === "PUBLISHED") {
        payload.publishedAt = new Date();
    }

    // Handle tags
    let tagConnections: { tagId: string }[] = [];
    if (payload.tags && payload.tags.length > 0) {
        // Create tags if they don't exist and get tag IDs
        const tagPromises = payload.tags.map(async (tagName: string) => {
            const slug = generateSlug(tagName);
            return await prisma.tag.upsert({
                where: { slug },
                update: {},
                create: {
                    name: tagName,
                    slug,
                },
            });
        });

        const tags = await Promise.all(tagPromises);
        tagConnections = tags.map((tag) => ({ tagId: tag.id }));
    }

    // Remove tags from payload as it's handled separately
    const { tags, ...productData } = payload;

    const result = await prisma.product.create({
        data: {
            ...productData,
            tags: {
                create: tagConnections,
            },
        },
        include: {
            category: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                },
            },
            tags: {
                include: {
                    tag: true,
                },
            },
            productVariants: true,
            reviews: {
                where: { isApproved: true },
                select: {
                    id: true,
                    rating: true,
                    title: true,
                    comment: true,
                    reviewerName: true,
                    createdAt: true,
                },
            },
            _count: {
                select: {
                    reviews: {
                        where: { isApproved: true },
                    },
                },
            },
        },
    });

    return result;
};

// Get all products with filtering and pagination
const getAllProducts = async (
    filters: IProductFilterRequest,
    options: IPaginationOptions
) => {
    const { limit, page, skip, sortBy, sortOrder } =
        formatQueryOptions(options);
    const {
        searchTerm,
        categoryId,
        status,
        isActive,
        isFeatured,
        isDigital,
        priceMin,
        priceMax,
        tags,
    } = filters;

    const andConditions: Prisma.ProductWhereInput[] = [];

    // Search functionality
    if (searchTerm) {
        andConditions.push({
            OR: productSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }

    // Filter by category
    if (categoryId) {
        andConditions.push({
            categoryId: categoryId,
        });
    }

    // Filter by status
    if (status) {
        andConditions.push({
            status: status as any,
        });
    }

    // Filter by active status
    if (isActive !== undefined) {
        andConditions.push({
            isActive: isActive,
        });
    }

    // Filter by featured status
    if (isFeatured !== undefined) {
        andConditions.push({
            isFeatured: isFeatured,
        });
    }

    // Filter by digital status
    if (isDigital !== undefined) {
        andConditions.push({
            isDigital: isDigital,
        });
    }

    // Filter by price range
    if (priceMin !== undefined || priceMax !== undefined) {
        const priceFilter: any = {};
        if (priceMin !== undefined) {
            priceFilter.gte = parseFloat(priceMin);
        }
        if (priceMax !== undefined) {
            priceFilter.lte = parseFloat(priceMax);
        }
        andConditions.push({
            price: priceFilter,
        });
    }

    // Filter by tags
    if (tags && tags.length > 0) {
        andConditions.push({
            tags: {
                some: {
                    tag: {
                        name: {
                            in: tags,
                        },
                    },
                },
            },
        });
    }

    const whereConditions: Prisma.ProductWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.product.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
        include: {
            category: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                },
            },
            tags: {
                include: {
                    tag: true,
                },
            },
            productVariants: true,
            reviews: {
                where: { isApproved: true },
                select: {
                    id: true,
                    rating: true,
                    title: true,
                    comment: true,
                    reviewerName: true,
                    createdAt: true,
                },
            },
            _count: {
                select: {
                    reviews: {
                        where: { isApproved: true },
                    },
                },
            },
        },
    });

    const total = await prisma.product.count({
        where: whereConditions,
    });

    return {
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
        data: result,
    };
};

// Get a single product by ID
const getSingleProduct = async (id: string) => {
    const result = await prisma.product.findUnique({
        where: {
            id,
        },
        include: {
            category: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                },
            },
            tags: {
                include: {
                    tag: true,
                },
            },
            productVariants: true,
            reviews: {
                where: { isApproved: true },
                select: {
                    id: true,
                    rating: true,
                    title: true,
                    comment: true,
                    reviewerName: true,
                    createdAt: true,
                },
            },
            _count: {
                select: {
                    reviews: {
                        where: { isApproved: true },
                    },
                },
            },
        },
    });

    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
    }

    return result;
};

// Get a single product by slug
const getProductBySlug = async (slug: string) => {
    const result = await prisma.product.findUnique({
        where: {
            slug,
        },
        include: {
            category: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                },
            },
            tags: {
                include: {
                    tag: true,
                },
            },
            productVariants: true,
            reviews: {
                where: { isApproved: true },
                select: {
                    id: true,
                    rating: true,
                    title: true,
                    comment: true,
                    reviewerName: true,
                    createdAt: true,
                },
            },
            _count: {
                select: {
                    reviews: {
                        where: { isApproved: true },
                    },
                },
            },
        },
    });

    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
    }

    return result;
};

// Update a product
const updateProduct = async (id: string, payload: any) => {
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
        where: { id },
    });

    if (!existingProduct) {
        throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
    }

    // Generate slug if name is being updated and slug is not provided
    if (payload.name && !payload.slug) {
        payload.slug = generateSlug(payload.name);
    }

    // Ensure slug is unique if it's being updated
    if (payload.slug && payload.slug !== existingProduct.slug) {
        const existingSlug = await prisma.product.findUnique({
            where: { slug: payload.slug },
        });

        if (existingSlug) {
            payload.slug = `${payload.slug}-${Date.now()}`;
        }
    }

    // Set publishedAt if status is being changed to PUBLISHED
    if (
        payload.status === "PUBLISHED" &&
        existingProduct.status !== "PUBLISHED"
    ) {
        payload.publishedAt = new Date();
    }

    // Handle tags if provided
    let tagOperations: any = {};
    if (payload.tags !== undefined) {
        // Delete existing tag connections
        await prisma.productTag.deleteMany({
            where: { productId: id },
        });

        // Create new tag connections if tags are provided
        if (payload.tags.length > 0) {
            const tagPromises = payload.tags.map(async (tagName: string) => {
                const slug = generateSlug(tagName);
                return await prisma.tag.upsert({
                    where: { slug },
                    update: {},
                    create: {
                        name: tagName,
                        slug,
                    },
                });
            });

            const tags = await Promise.all(tagPromises);
            const tagConnections = tags.map((tag) => ({ tagId: tag.id }));

            tagOperations = {
                tags: {
                    create: tagConnections,
                },
            };
        }
    }

    // Remove tags from payload as it's handled separately
    const { tags, ...productData } = payload;

    const result = await prisma.product.update({
        where: {
            id,
        },
        data: {
            ...productData,
            ...tagOperations,
        },
        include: {
            category: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                },
            },
            tags: {
                include: {
                    tag: true,
                },
            },
            productVariants: true,
            reviews: {
                where: { isApproved: true },
                select: {
                    id: true,
                    rating: true,
                    title: true,
                    comment: true,
                    reviewerName: true,
                    createdAt: true,
                },
            },
            _count: {
                select: {
                    reviews: {
                        where: { isApproved: true },
                    },
                },
            },
        },
    });

    return result;
};

// Delete a product
const deleteProduct = async (id: string) => {
    const existingProduct = await prisma.product.findUnique({
        where: { id },
    });

    if (!existingProduct) {
        throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
    }

    const result = await prisma.product.delete({
        where: {
            id,
        },
    });

    return result;
};

// Create a product variant
const createProductVariant = async (payload: any) => {
    // Check if product exists
    const product = await prisma.product.findUnique({
        where: { id: payload.productId },
    });

    if (!product) {
        throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
    }

    const result = await prisma.productVariant.create({
        data: payload,
        include: {
            product: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                },
            },
        },
    });

    return result;
};

// Get product variants
const getProductVariants = async (productId: string) => {
    const result = await prisma.productVariant.findMany({
        where: {
            productId,
        },
        include: {
            product: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                },
            },
        },
    });

    return result;
};

// Update product variant
const updateProductVariant = async (id: string, payload: any) => {
    const existingVariant = await prisma.productVariant.findUnique({
        where: { id },
    });

    if (!existingVariant) {
        throw new ApiError(httpStatus.NOT_FOUND, "Product variant not found");
    }

    const result = await prisma.productVariant.update({
        where: { id },
        data: payload,
        include: {
            product: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                },
            },
        },
    });

    return result;
};

// Delete product variant
const deleteProductVariant = async (id: string) => {
    const existingVariant = await prisma.productVariant.findUnique({
        where: { id },
    });

    if (!existingVariant) {
        throw new ApiError(httpStatus.NOT_FOUND, "Product variant not found");
    }

    const result = await prisma.productVariant.delete({
        where: { id },
    });

    return result;
};

// Create a product review
const createProductReview = async (payload: any) => {
    // Check if product exists
    const product = await prisma.product.findUnique({
        where: { id: payload.productId },
    });

    if (!product) {
        throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
    }

    const result = await prisma.productReview.create({
        data: payload,
        include: {
            product: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                },
            },
        },
    });

    return result;
};

// Get product reviews
const getProductReviews = async (
    productId: string,
    options: IPaginationOptions
) => {
    const { limit, page, skip, sortBy, sortOrder } =
        formatQueryOptions(options);

    const result = await prisma.productReview.findMany({
        where: {
            productId,
            isApproved: true,
        },
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
        include: {
            product: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                },
            },
        },
    });

    const total = await prisma.productReview.count({
        where: {
            productId,
            isApproved: true,
        },
    });

    return {
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
        data: result,
    };
};

// Update review status (approve/disapprove)
const updateReviewStatus = async (id: string, isApproved: boolean) => {
    const existingReview = await prisma.productReview.findUnique({
        where: { id },
    });

    if (!existingReview) {
        throw new ApiError(httpStatus.NOT_FOUND, "Review not found");
    }

    const result = await prisma.productReview.update({
        where: { id },
        data: { isApproved },
        include: {
            product: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                },
            },
        },
    });

    return result;
};

// Delete product review
const deleteProductReview = async (id: string) => {
    const existingReview = await prisma.productReview.findUnique({
        where: { id },
    });

    if (!existingReview) {
        throw new ApiError(httpStatus.NOT_FOUND, "Review not found");
    }

    const result = await prisma.productReview.delete({
        where: { id },
    });

    return result;
};

// Get all tags
const getAllTags = async (options: IPaginationOptions) => {
    const { limit, page, skip, sortBy, sortOrder } =
        formatQueryOptions(options);

    const result = await prisma.tag.findMany({
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
        include: {
            _count: {
                select: {
                    products: true,
                },
            },
        },
    });

    const total = await prisma.tag.count();

    return {
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
        data: result,
    };
};

// Create a tag
const createTag = async (payload: any) => {
    // Generate slug if not provided
    if (!payload.slug) {
        payload.slug = generateSlug(payload.name);
    }

    // Ensure slug is unique
    const existingTag = await prisma.tag.findUnique({
        where: { slug: payload.slug },
    });

    if (existingTag) {
        throw new ApiError(
            httpStatus.CONFLICT,
            "Tag with this name already exists"
        );
    }

    const result = await prisma.tag.create({
        data: payload,
        include: {
            _count: {
                select: {
                    products: true,
                },
            },
        },
    });

    return result;
};

// Update a tag
const updateTag = async (id: string, payload: any) => {
    const existingTag = await prisma.tag.findUnique({
        where: { id },
    });

    if (!existingTag) {
        throw new ApiError(httpStatus.NOT_FOUND, "Tag not found");
    }

    // Generate slug if name is being updated and slug is not provided
    if (payload.name && !payload.slug) {
        payload.slug = generateSlug(payload.name);
    }

    // Ensure slug is unique if it's being updated
    if (payload.slug && payload.slug !== existingTag.slug) {
        const existingSlug = await prisma.tag.findUnique({
            where: { slug: payload.slug },
        });

        if (existingSlug) {
            throw new ApiError(
                httpStatus.CONFLICT,
                "Tag with this name already exists"
            );
        }
    }

    const result = await prisma.tag.update({
        where: { id },
        data: payload,
        include: {
            _count: {
                select: {
                    products: true,
                },
            },
        },
    });

    return result;
};

// Delete a tag
const deleteTag = async (id: string) => {
    const existingTag = await prisma.tag.findUnique({
        where: { id },
    });

    if (!existingTag) {
        throw new ApiError(httpStatus.NOT_FOUND, "Tag not found");
    }

    const result = await prisma.tag.delete({
        where: { id },
    });

    return result;
};

export const ProductService = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    getProductBySlug,
    updateProduct,
    deleteProduct,
    createProductVariant,
    getProductVariants,
    updateProductVariant,
    deleteProductVariant,
    createProductReview,
    getProductReviews,
    updateReviewStatus,
    deleteProductReview,
    getAllTags,
    createTag,
    updateTag,
    deleteTag,
};
