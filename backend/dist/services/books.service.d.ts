import { CreateBookInput, UpdateBookInput, PaginationQuery } from "../types";
export declare const booksService: {
    listBooks(query: PaginationQuery & {
        status?: string;
        shelfId?: number;
        search?: string;
    }): Promise<{
        books: ({
            shelf: {
                id: number;
                notes: string | null;
                createdAt: Date;
                updatedAt: Date;
                label: string;
                sectionLetter: string;
                shelfNumber: number;
                capacity: number | null;
            } | null;
        } & {
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
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    getBook(id: number): Promise<{
        shelf: {
            id: number;
            notes: string | null;
            createdAt: Date;
            updatedAt: Date;
            label: string;
            sectionLetter: string;
            shelfNumber: number;
            capacity: number | null;
        } | null;
        photos: {
            id: number;
            filePath: string;
            uploadedAt: Date;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            bookId: number | null;
        }[];
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
    }>;
    createBook(data: CreateBookInput): Promise<{
        shelf: {
            id: number;
            notes: string | null;
            createdAt: Date;
            updatedAt: Date;
            label: string;
            sectionLetter: string;
            shelfNumber: number;
            capacity: number | null;
        } | null;
    } & {
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
    }>;
    updateBook(id: number, data: UpdateBookInput): Promise<{
        shelf: {
            id: number;
            notes: string | null;
            createdAt: Date;
            updatedAt: Date;
            label: string;
            sectionLetter: string;
            shelfNumber: number;
            capacity: number | null;
        } | null;
    } & {
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
    }>;
    deleteBook(id: number): Promise<{
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
    }>;
    getBookByIsbn(isbn: string): Promise<({
        shelf: {
            id: number;
            notes: string | null;
            createdAt: Date;
            updatedAt: Date;
            label: string;
            sectionLetter: string;
            shelfNumber: number;
            capacity: number | null;
        } | null;
    } & {
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
    }) | null>;
    getStats(): Promise<{
        total: number;
        catalogued: number;
        percentCatalogued: number;
        byStatus: {
            status: string;
            count: number;
        }[];
        byShelf: {
            shelfId: number | null;
            count: number;
        }[];
    }>;
};
//# sourceMappingURL=books.service.d.ts.map