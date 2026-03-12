import { CreateShelfInput } from "../types";
export declare const shelvesService: {
    listShelves(): Promise<({
        _count: {
            books: number;
        };
    } & {
        id: number;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        label: string;
        sectionLetter: string;
        shelfNumber: number;
        capacity: number | null;
    })[]>;
    getShelf(id: number): Promise<{
        books: {
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
        }[];
    } & {
        id: number;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        label: string;
        sectionLetter: string;
        shelfNumber: number;
        capacity: number | null;
    }>;
    getShelfByLabel(label: string): Promise<({
        books: {
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
        }[];
    } & {
        id: number;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        label: string;
        sectionLetter: string;
        shelfNumber: number;
        capacity: number | null;
    }) | null>;
    createShelf(data: CreateShelfInput): Promise<{
        books: {
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
        }[];
    } & {
        id: number;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        label: string;
        sectionLetter: string;
        shelfNumber: number;
        capacity: number | null;
    }>;
    updateShelf(id: number, data: Partial<CreateShelfInput>): Promise<{
        id: number;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        label: string;
        sectionLetter: string;
        shelfNumber: number;
        capacity: number | null;
    }>;
    deleteShelf(id: number): Promise<{
        id: number;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        label: string;
        sectionLetter: string;
        shelfNumber: number;
        capacity: number | null;
    }>;
};
//# sourceMappingURL=shelves.service.d.ts.map