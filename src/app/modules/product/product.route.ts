import express from "express";
import { ProductController } from "./product.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { ProductValidation } from "./product.validation";

const router = express.Router();

// Product Routes
router.post(
    "/",
    validateRequest(ProductValidation.createProduct),
    ProductController.createProduct
);

router.get("/", ProductController.getAllProducts);

router.get("/slug/:slug", ProductController.getProductBySlug);

router.get("/:id", ProductController.getSingleProduct);

router.patch(
    "/:id",
    validateRequest(ProductValidation.updateProduct),
    ProductController.updateProduct
);

router.delete("/:id", ProductController.deleteProduct);

// Product Variant Routes
router.post(
    "/variants",
    validateRequest(ProductValidation.createProductVariant),
    ProductController.createProductVariant
);

router.get("/:productId/variants", ProductController.getProductVariants);

router.patch("/variants/:id", ProductController.updateProductVariant);

router.delete("/variants/:id", ProductController.deleteProductVariant);

// Product Review Routes
router.post(
    "/reviews",
    validateRequest(ProductValidation.createProductReview),
    ProductController.createProductReview
);

router.get("/:productId/reviews", ProductController.getProductReviews);

router.patch("/reviews/:id/status", ProductController.updateReviewStatus);

router.delete("/reviews/:id", ProductController.deleteProductReview);

// Tag Routes
router.get("/tags/all", ProductController.getAllTags);

router.post(
    "/tags",
    validateRequest(ProductValidation.createTag),
    ProductController.createTag
);

router.patch("/tags/:id", ProductController.updateTag);

router.delete("/tags/:id", ProductController.deleteTag);

export const ProductRoutes = router;
