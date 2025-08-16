import { z } from "zod";

const updateGallery = z.object({
    body: z.object({
        name: z.string().optional(),
        isActive: z.boolean().optional(),
        description: z.string().optional(),
    }),
});

const deleteMultipleImages = z.object({
    body: z.object({
        ids: z.array(z.string()).min(1, "At least one image ID is required"),
    }),
});

export const GalleryValidation = {
    updateGallery,
    deleteMultipleImages,
};
