export declare const photosService: {
    uploadPhoto(fileBuffer: Buffer, filename: string, bookId?: number): Promise<{
        id: number;
        filePath: string;
        uploadedAt: Date;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        bookId: number | null;
    }>;
    listPhotos(bookId?: number): Promise<({
        ocrResults: {
            id: number;
            extractedTitle: string | null;
            extractedAuthor: string | null;
            confidence: number | null;
        }[];
    } & {
        id: number;
        filePath: string;
        uploadedAt: Date;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        bookId: number | null;
    })[]>;
    getPhoto(id: number): Promise<{
        book: {
            id: number;
            title: string;
            author: string | null;
            isbn: string | null;
            coverImagePath: string | null;
            notes: string | null;
            shelfId: number | null;
            positionIndex: number | null;
            status: string;
            statusUpdatedAt: Date;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        } | null;
        ocrResults: {
            id: number;
            bookId: number | null;
            photoId: number;
            extractedTitle: string | null;
            extractedAuthor: string | null;
            extractedIsbn: string | null;
            confidence: number | null;
            rawText: string | null;
            processedAt: Date;
        }[];
    } & {
        id: number;
        filePath: string;
        uploadedAt: Date;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        bookId: number | null;
    }>;
    deletePhoto(id: number): Promise<{
        id: number;
        filePath: string;
        uploadedAt: Date;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        bookId: number | null;
    }>;
    updatePhotoMetadata(id: number, metadata: any): Promise<{
        id: number;
        filePath: string;
        uploadedAt: Date;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        bookId: number | null;
    }>;
};
//# sourceMappingURL=photos.service.d.ts.map