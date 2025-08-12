import { Category } from "../../../generated/prisma";
import prisma from "../../utils/prisma";

const createCategory = async (payload: Category) => {
    const result = prisma.category.create({
        data: payload,
    });

    return result;
};

export const CategoryService = {
    createCategory,
};
