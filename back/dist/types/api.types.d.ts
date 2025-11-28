import { UserRole } from "@prisma/client";
export interface CreateArticleDTO {
    title: string;
    content: string;
    imageUrl?: string;
    category: string;
    tags?: string[];
}
export interface UpdateArticleDTO {
    title?: string;
    content?: string;
    imageUrl?: string;
    category?: string;
    tags?: string[];
}
export interface ArticleResponseDTO {
    id: string;
    title: string;
    content: string;
    imageUrl?: string;
    category: string;
    tags: string[];
    authorId: string;
    authorName: string;
    createdAt: string;
    updatedAt: string;
    likes: number;
    likedBy: string[];
}
export interface UserResponseDTO {
    id: string;
    name: string;
    email: string;
    image?: string;
    role: UserRole;
    createdAt: string;
    lastLogin?: string;
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
//# sourceMappingURL=api.types.d.ts.map