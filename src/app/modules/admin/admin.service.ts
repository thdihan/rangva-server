import { Admin, Prisma, UserStatus } from "../../../generated/prisma";
import { adminSearchableFields } from "./admin.constant";
import {
    formatQueryOptions,
    TQueryOptions,
} from "../../utils/formatQueryOptions";
import prisma from "../../utils/prisma";
import { TFilterParams } from "./admin.interface";

const getAllAdminsFromDB = async (
    params: TFilterParams,
    options: TQueryOptions
) => {
    console.log("[LOG : admin.service -> getAllAdminsFromDB()] Called");
    console.log(
        "[LOG : admin.service -> getAllAdminsFromDB()] Params\n",
        params
    );

    const { searchTerm, ...filterTypes } = params;
    const { page, skip, limit, sortBy, sortOrder } =
        formatQueryOptions(options);

    console.log(
        "[LOG : admin.service -> getAllAdminsFromDB()] Search Term\n",
        searchTerm
    );

    console.log(
        "[LOG : admin.service -> getAllAdminsFromDB()] Filter Types\n",
        filterTypes
    );

    console.log("[LOG : admin.service -> getAllAdminsFromDB()] Options\n", {
        page,
        skip,
        limit,
        sortBy,
        sortOrder,
    });

    const andConditions: Prisma.AdminWhereInput[] = [];

    // Search using name and email.
    if (searchTerm) {
        andConditions.push({
            OR: adminSearchableFields.map((field) => ({
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

    andConditions.push({
        isDeleted: false,
    });

    const whereConditions: Prisma.AdminWhereInput = { AND: andConditions };
    const result = await prisma.admin.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
    });

    const total = await prisma.admin.count({
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

const getAdminByIdFromDB = async (id: string): Promise<Admin | null> => {
    const result = await prisma.admin.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false,
        },
    });

    return result;
};

const updateAdminByIdIntoDB = async (
    id: string,
    data: Partial<Admin>
): Promise<Admin | null> => {
    await prisma.admin.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false,
        },
    });
    const result = await prisma.admin.update({
        where: {
            id,
        },
        data,
    });

    return result;
};

const deleteAdminFromDB = async (id: string): Promise<Admin | null> => {
    const result = await prisma.$transaction(async (client) => {
        const deletedAdmin = await client.admin.delete({
            where: {
                id,
            },
        });

        await client.user.delete({
            where: {
                email: deletedAdmin.email,
            },
        });

        return deletedAdmin;
    });

    return result;
};
const softDeleteAdminFromDB = async (id: string): Promise<Admin | null> => {
    const result = await prisma.$transaction(async (client) => {
        const deletedAdmin = await client.admin.update({
            where: {
                id,
                isDeleted: false,
            },
            data: {
                isDeleted: true,
            },
        });

        await client.user.update({
            where: {
                email: deletedAdmin.email,
            },
            data: {
                status: UserStatus.DELETED,
            },
        });

        return deletedAdmin;
    });

    return result;
};

export const AdminService = {
    getAllAdminsFromDB,
    getAdminByIdFromDB,
    updateAdminByIdIntoDB,
    deleteAdminFromDB,
    softDeleteAdminFromDB,
};
