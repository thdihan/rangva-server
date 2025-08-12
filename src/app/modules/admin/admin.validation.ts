import { z } from "zod";

export const update = z.object({
    body: z.object({
        name: z.string().optional(),
        contactNumber: z.string().optional(),
        profilePhoto: z.string().optional(),
    }),
});

export const AdminValidationSchema = {
    update,
};
