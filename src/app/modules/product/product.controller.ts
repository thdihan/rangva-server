import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ProductService } from "./product.service";
import { pick } from "../../utils/pick";
import { productFilterableFields } from "./product.constant";

// Create a new product
const createProduct = catchAsync(async (req: Request, res: Response) => {
    const result = await ProductService.createProduct(req.body);

    sendResponse(res, {
        status: httpStatus.CREATED,
        success: true,
        message: "Product created successfully",
        data: result,
    });
});

// Get all products with filtering and pagination
const getAllProducts = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, productFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

    const result = await ProductService.getAllProducts(filters, options);

    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Products retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});

// Get a single product by ID
const getSingleProduct = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await ProductService.getSingleProduct(id);

    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Product retrieved successfully",
        data: result,
    });
});

// Get a single product by slug
const getProductBySlug = catchAsync(async (req: Request, res: Response) => {
    const { slug } = req.params;
    const result = await ProductService.getProductBySlug(slug);

    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Product retrieved successfully",
        data: result,
    });
});

// Update a product
const updateProduct = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await ProductService.updateProduct(id, req.body);

    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Product updated successfully",
        data: result,
    });
});

// Delete a product
const deleteProduct = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await ProductService.deleteProduct(id);

    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Product deleted successfully",
        data: result,
    });
});

// Create a product variant
const createProductVariant = catchAsync(async (req: Request, res: Response) => {
    const result = await ProductService.createProductVariant(req.body);

    sendResponse(res, {
        status: httpStatus.CREATED,
        success: true,
        message: "Product variant created successfully",
        data: result,
    });
});

// Get product variants
const getProductVariants = catchAsync(async (req: Request, res: Response) => {
    const { productId } = req.params;
    const result = await ProductService.getProductVariants(productId);

    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Product variants retrieved successfully",
        data: result,
    });
});

// Update product variant
const updateProductVariant = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await ProductService.updateProductVariant(id, req.body);

    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Product variant updated successfully",
        data: result,
    });
});

// Delete product variant
const deleteProductVariant = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await ProductService.deleteProductVariant(id);

    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Product variant deleted successfully",
        data: result,
    });
});

// Create a product review
const createProductReview = catchAsync(async (req: Request, res: Response) => {
    const result = await ProductService.createProductReview(req.body);

    sendResponse(res, {
        status: httpStatus.CREATED,
        success: true,
        message: "Product review created successfully",
        data: result,
    });
});

// Get product reviews
const getProductReviews = catchAsync(async (req: Request, res: Response) => {
    const { productId } = req.params;
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

    const result = await ProductService.getProductReviews(productId, options);

    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Product reviews retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});

// Update review status (approve/disapprove)
const updateReviewStatus = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { isApproved } = req.body;
    const result = await ProductService.updateReviewStatus(id, isApproved);

    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: `Review ${
            isApproved ? "approved" : "disapproved"
        } successfully`,
        data: result,
    });
});

// Delete product review
const deleteProductReview = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await ProductService.deleteProductReview(id);

    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Product review deleted successfully",
        data: result,
    });
});

// Get all tags
const getAllTags = catchAsync(async (req: Request, res: Response) => {
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

    const result = await ProductService.getAllTags(options);

    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Tags retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});

// Create a tag
const createTag = catchAsync(async (req: Request, res: Response) => {
    const result = await ProductService.createTag(req.body);

    sendResponse(res, {
        status: httpStatus.CREATED,
        success: true,
        message: "Tag created successfully",
        data: result,
    });
});

// Update a tag
const updateTag = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await ProductService.updateTag(id, req.body);

    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Tag updated successfully",
        data: result,
    });
});

// Delete a tag
const deleteTag = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await ProductService.deleteTag(id);

    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Tag deleted successfully",
        data: result,
    });
});

export const ProductController = {
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
