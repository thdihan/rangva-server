import { Category, Prisma } from "../../../generated/prisma";
import prisma from "../../utils/prisma";
import { categorySearchableFields } from "./category.constant";
import {
    formatQueryOptions,
    TQueryOptions,
} from "../../utils/formatQueryOptions";
import { TCategoryFilterParams } from "./category.interface";

const createCategory = async (payload: Category) => {
    const result = prisma.category.create({
        data: payload,
    });

    return result;
};

const getAllCategory = async (
    params: TCategoryFilterParams,
    options: TQueryOptions
) => {
    console.log("[LOG : category.service -> getAllCategory()] Called");
    console.log(
        "[LOG : category.service -> getAllCategory()] Params\n",
        params
    );

    const { searchTerm, ...filterTypes } = params;
    const { page, skip, limit, sortBy, sortOrder } =
        formatQueryOptions(options);

    console.log(
        "[LOG : category.service -> getAllCategory()] Search Term\n",
        searchTerm
    );

    console.log(
        "[LOG : category.service -> getAllCategory()] Filter Types\n",
        filterTypes
    );

    console.log("[LOG : category.service -> getAllCategory()] Options\n", {
        page,
        skip,
        limit,
        sortBy,
        sortOrder,
    });

    const andConditions: Prisma.CategoryWhereInput[] = [];

    // Search using name and description.
    if (searchTerm) {
        andConditions.push({
            OR: categorySearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }

    // Filter based on equals of field
    if (Object.keys(filterTypes).length > 0) {
        andConditions.push({
            AND: Object.keys(filterTypes).map((key) => ({
                [key as keyof typeof filterTypes]: {
                    equals: filterTypes[key as keyof typeof filterTypes],
                },
            })),
        });
    }

    const whereConditions: Prisma.CategoryWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.category.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
    });

    const total = await prisma.category.count({
        where: whereConditions,
    });

    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};

const getCategoryByIdFromDB = async (id: string): Promise<Category | null> => {
    const result = await prisma.category.findUniqueOrThrow({
        where: {
            id,
        },
    });

    return result;
};

const updateCategoryByIdIntoDB = async (
    id: string,
    data: Partial<Category>
): Promise<Category | null> => {
    await prisma.category.findUniqueOrThrow({
        where: {
            id,
        },
    });

    const result = await prisma.category.update({
        where: {
            id,
        },
        data,
    });

    return result;
};

const deleteCategoryFromDB = async (id: string): Promise<Category | null> => {
    const result = await prisma.category.delete({
        where: {
            id,
        },
    });

    return result;
};

export const CategoryService = {
    createCategory,
    getAllCategory,
    getCategoryByIdFromDB,
    updateCategoryByIdIntoDB,
    deleteCategoryFromDB,
};
