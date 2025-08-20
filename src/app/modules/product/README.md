# Product Module API Documentation

## Overview

The Product module provides comprehensive CRUD operations for managing products, variants, reviews, and tags in the e-commerce system.

## Base URL

All product endpoints are prefixed with `/api/v1/products`

## Product Endpoints

### Create Product

-   **POST** `/api/v1/products`
-   **Description**: Create a new product
-   **Body**: Product data (see ProductValidation.createProduct schema)
-   **Response**: Created product with relations

### Get All Products

-   **GET** `/api/v1/products`
-   **Description**: Get all products with filtering and pagination
-   **Query Parameters**:
    -   `page` (number): Page number
    -   `limit` (number): Items per page
    -   `searchTerm` (string): Search in name, description, SKU
    -   `categoryId` (string): Filter by category
    -   `status` (string): Filter by status (DRAFT, PUBLISHED, ARCHIVED, OUT_OF_STOCK)
    -   `isActive` (boolean): Filter by active status
    -   `isFeatured` (boolean): Filter by featured status
    -   `isDigital` (boolean): Filter by digital status
    -   `priceMin` (number): Minimum price filter
    -   `priceMax` (number): Maximum price filter
    -   `tags` (array): Filter by tags
    -   `sortBy` (string): Sort field
    -   `sortOrder` (string): Sort order (asc/desc)

### Get Product by ID

-   **GET** `/api/v1/products/:id`
-   **Description**: Get a single product by ID
-   **Response**: Product with full relations

### Get Product by Slug

-   **GET** `/api/v1/products/slug/:slug`
-   **Description**: Get a single product by slug
-   **Response**: Product with full relations

### Update Product

-   **PATCH** `/api/v1/products/:id`
-   **Description**: Update a product
-   **Body**: Updated product data
-   **Response**: Updated product with relations

### Delete Product

-   **DELETE** `/api/v1/products/:id`
-   **Description**: Delete a product
-   **Response**: Deleted product data

## Product Variant Endpoints

### Create Product Variant

-   **POST** `/api/v1/products/variants`
-   **Description**: Create a new product variant
-   **Body**: Variant data (see ProductValidation.createProductVariant schema)

### Get Product Variants

-   **GET** `/api/v1/products/:productId/variants`
-   **Description**: Get all variants for a specific product

### Update Product Variant

-   **PATCH** `/api/v1/products/variants/:id`
-   **Description**: Update a product variant

### Delete Product Variant

-   **DELETE** `/api/v1/products/variants/:id`
-   **Description**: Delete a product variant

## Product Review Endpoints

### Create Product Review

-   **POST** `/api/v1/products/reviews`
-   **Description**: Create a new product review
-   **Body**: Review data (see ProductValidation.createProductReview schema)

### Get Product Reviews

-   **GET** `/api/v1/products/:productId/reviews`
-   **Description**: Get all approved reviews for a specific product
-   **Query Parameters**: Pagination options

### Update Review Status

-   **PATCH** `/api/v1/products/reviews/:id/status`
-   **Description**: Approve or disapprove a review
-   **Body**: `{ "isApproved": boolean }`

### Delete Product Review

-   **DELETE** `/api/v1/products/reviews/:id`
-   **Description**: Delete a product review

## Tag Endpoints

### Get All Tags

-   **GET** `/api/v1/products/tags/all`
-   **Description**: Get all tags with product count
-   **Query Parameters**: Pagination options

### Create Tag

-   **POST** `/api/v1/products/tags`
-   **Description**: Create a new tag
-   **Body**: Tag data (see ProductValidation.createTag schema)

### Update Tag

-   **PATCH** `/api/v1/products/tags/:id`
-   **Description**: Update a tag

### Delete Tag

-   **DELETE** `/api/v1/products/tags/:id`
-   **Description**: Delete a tag

## Data Models

### Product

-   `id`: UUID (auto-generated)
-   `name`: string (required)
-   `slug`: string (auto-generated from name if not provided)
-   `description`: string (optional)
-   `shortDescription`: string (optional)
-   `price`: decimal (required)
-   `salePrice`: decimal (optional)
-   `costPrice`: decimal (optional)
-   `sku`: string (optional, unique)
-   `stock`: integer (default: 0)
-   `minStock`: integer (default: 0)
-   `maxStock`: integer (optional)
-   `trackStock`: boolean (default: true)
-   `weight`: decimal (optional)
-   `dimensions`: string (optional)
-   `status`: enum (DRAFT, PUBLISHED, ARCHIVED, OUT_OF_STOCK)
-   `isActive`: boolean (default: true)
-   `isFeatured`: boolean (default: false)
-   `isDigital`: boolean (default: false)
-   `metaTitle`: string (optional)
-   `metaDescription`: string (optional)
-   `metaKeywords`: string (optional)
-   `images`: array of strings (URLs)
-   `thumbnail`: string (URL, optional)
-   `gallery`: array of strings (Gallery IDs)
-   `categoryId`: UUID (required)
-   `attributes`: JSON object (optional)
-   `specifications`: JSON object (optional)
-   `tags`: array of strings

### Product Variant

-   `id`: UUID (auto-generated)
-   `productId`: UUID (required)
-   `name`: string (required)
-   `sku`: string (optional, unique)
-   `price`: decimal (required)
-   `salePrice`: decimal (optional)
-   `stock`: integer (default: 0)
-   `isActive`: boolean (default: true)
-   `attributes`: JSON object (required)
-   `image`: string (URL, optional)

### Product Review

-   `id`: UUID (auto-generated)
-   `productId`: UUID (required)
-   `rating`: integer (1-5, required)
-   `title`: string (optional)
-   `comment`: string (required)
-   `reviewerName`: string (required)
-   `reviewerEmail`: string (required)
-   `isApproved`: boolean (default: false)
-   `isVerified`: boolean (default: false)

### Tag

-   `id`: UUID (auto-generated)
-   `name`: string (required, unique)
-   `slug`: string (auto-generated from name if not provided, unique)
-   `description`: string (optional)
-   `color`: string (hex color, optional)

## Features

### Automatic Slug Generation

-   Slugs are automatically generated from names if not provided
-   Duplicate slugs are handled by appending timestamps

### Tag Management

-   Tags are automatically created if they don't exist when creating/updating products
-   Tag relationships are managed through the ProductTag junction table

### Search and Filtering

-   Full-text search across name, description, SKU, and meta fields
-   Multiple filter options including price range, status, and tag filters
-   Flexible sorting options

### Review System

-   Reviews require approval before being displayed
-   Support for both guest and verified reviews
-   Rating aggregation support

### Product Variants

-   Support for product variations with different attributes
-   Independent pricing and inventory for each variant
-   Flexible attribute system using JSON

### Inventory Management

-   Stock tracking with min/max stock levels
-   Support for digital products (no inventory tracking)
-   Out of stock status handling

### SEO Support

-   Meta title, description, and keywords
-   Friendly URL slugs
-   Structured data support through relations

## Error Handling

All endpoints return standardized error responses with appropriate HTTP status codes:

-   400: Bad Request (validation errors)
-   404: Not Found (resource not found)
-   409: Conflict (duplicate slug/name)
-   500: Internal Server Error

## Response Format

All successful responses follow this format:

```json
{
  "status": 200,
  "success": true,
  "message": "Operation successful",
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  },
  "data": {...}
}
```
