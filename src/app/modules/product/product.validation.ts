import { z } from "zod";

const createProductSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Product name is required"),
        slug: z.string().optional(),
        description: z.string().optional(),
        shortDescription: z.string().optional(),

        // Pricing
        price: z.number().positive("Price must be positive"),
        salePrice: z.number().positive().optional(),
        costPrice: z.number().positive().optional(),

        // Inventory
        sku: z.string().optional(),
        stock: z.number().int().min(0, "Stock cannot be negative").default(0),
        minStock: z.number().int().min(0).default(0),
        maxStock: z.number().int().positive().optional(),
        trackStock: z.boolean().default(true),

        // Physical attributes
        weight: z.number().positive().optional(),
        dimensions: z.string().optional(),

        // Product status
        status: z
            .enum(["DRAFT", "PUBLISHED", "ARCHIVED", "OUT_OF_STOCK"])
            .default("DRAFT"),
        isActive: z.boolean().default(true),
        isFeatured: z.boolean().default(false),
        isDigital: z.boolean().default(false),

        // SEO
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        metaKeywords: z.string().optional(),

        // Media
        images: z.array(z.string()).default([]),
        thumbnail: z.string().optional(),
        gallery: z.array(z.string()).default([]),

        // Category relation
        categoryId: z.string().uuid("Invalid category ID"),

        // Additional attributes
        attributes: z.record(z.any()).optional(),
        specifications: z.record(z.any()).optional(),

        // Tags
        tags: z.array(z.string()).optional(),
    }),
});

const updateProductSchema = z.object({
    body: z.object({
        name: z.string().min(1).optional(),
        slug: z.string().optional(),
        description: z.string().optional(),
        shortDescription: z.string().optional(),

        // Pricing
        price: z.number().positive().optional(),
        salePrice: z.number().positive().optional(),
        costPrice: z.number().positive().optional(),

        // Inventory
        sku: z.string().optional(),
        stock: z.number().int().min(0).optional(),
        minStock: z.number().int().min(0).optional(),
        maxStock: z.number().int().positive().optional(),
        trackStock: z.boolean().optional(),

        // Physical attributes
        weight: z.number().positive().optional(),
        dimensions: z.string().optional(),

        // Product status
        status: z
            .enum(["DRAFT", "PUBLISHED", "ARCHIVED", "OUT_OF_STOCK"])
            .optional(),
        isActive: z.boolean().optional(),
        isFeatured: z.boolean().optional(),
        isDigital: z.boolean().optional(),

        // SEO
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        metaKeywords: z.string().optional(),

        // Media
        images: z.array(z.string()).optional(),
        thumbnail: z.string().optional(),
        gallery: z.array(z.string()).optional(),

        // Category relation
        categoryId: z.string().uuid().optional(),

        // Additional attributes
        attributes: z.record(z.any()).optional(),
        specifications: z.record(z.any()).optional(),

        // Tags
        tags: z.array(z.string()).optional(),
    }),
});

const createProductVariantSchema = z.object({
    body: z.object({
        productId: z.string().uuid("Invalid product ID"),
        name: z.string().min(1, "Variant name is required"),
        sku: z.string().optional(),
        price: z.number().positive("Price must be positive"),
        salePrice: z.number().positive().optional(),
        stock: z.number().int().min(0).default(0),
        isActive: z.boolean().default(true),
        attributes: z
            .record(z.any())
            .refine((val) => Object.keys(val).length > 0, {
                message: "Attributes are required",
            }),
        image: z.string().optional(),
    }),
});

const createProductReviewSchema = z.object({
    body: z.object({
        productId: z.string().uuid("Invalid product ID"),
        rating: z
            .number()
            .int()
            .min(1)
            .max(5, "Rating must be between 1 and 5"),
        title: z.string().optional(),
        comment: z.string().min(1, "Comment is required"),
        reviewerName: z.string().min(1, "Reviewer name is required"),
        reviewerEmail: z.string().email("Invalid email address"),
    }),
});

const createTagSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Tag name is required"),
        slug: z.string().optional(),
        description: z.string().optional(),
        color: z
            .string()
            .regex(/^#[0-9A-F]{6}$/i, "Invalid hex color")
            .optional(),
    }),
});

export const ProductValidation = {
    createProduct: createProductSchema,
    updateProduct: updateProductSchema,
    createProductVariant: createProductVariantSchema,
    createProductReview: createProductReviewSchema,
    createTag: createTagSchema,
};
