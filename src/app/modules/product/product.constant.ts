export const productFilterableFields = [
    "name",
    "slug",
    "status",
    "isActive",
    "isFeatured",
    "isDigital",
    "categoryId",
    "price",
    "stock",
    "searchTerm",
    "tags",
];

export const productSearchableFields = [
    "name",
    "description",
    "shortDescription",
    "sku",
    "metaTitle",
    "metaKeywords",
];

export const PRODUCT_STATUS = {
    DRAFT: "DRAFT",
    PUBLISHED: "PUBLISHED",
    ARCHIVED: "ARCHIVED",
    OUT_OF_STOCK: "OUT_OF_STOCK",
} as const;

export const SORT_OPTIONS = {
    NEWEST: "createdAt_desc",
    OLDEST: "createdAt_asc",
    PRICE_LOW_HIGH: "price_asc",
    PRICE_HIGH_LOW: "price_desc",
    NAME_A_Z: "name_asc",
    NAME_Z_A: "name_desc",
    FEATURED: "isFeatured_desc",
    STOCK_HIGH_LOW: "stock_desc",
    RATING_HIGH_LOW: "rating_desc",
} as const;
