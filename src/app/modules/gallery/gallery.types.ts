export interface TGalleryCreateInput {
    name: string;
    originalName: string;
    url: string;
    cloudinaryId?: string;
    size: number;
    mimeType: string;
    isActive?: boolean;
    description?: string;
}

export interface TGalleryUpdateInput {
    name?: string;
    isActive?: boolean;
    description?: string;
}

export interface TGalleryResponse {
    id: string;
    name: string;
    originalName: string;
    url: string;
    cloudinaryId: string | null;
    size: number;
    mimeType: string;
    isActive: boolean;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
}
