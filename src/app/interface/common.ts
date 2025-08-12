import { UserRole } from "../../generated/prisma";

export type TAuthUser = {
    email?: string;
    role?: UserRole;
} | null;
