import { OcrAnalysisResult } from "../types";
export declare const ocrService: {
    analyzePhoto(photoId: number): Promise<OcrAnalysisResult>;
    getPendingPhotos(): Promise<{
        id: number;
        filePath: string;
        uploadedAt: Date;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        bookId: number | null;
    }[]>;
    extractBooksFromText(text: string[]): Promise<({
        title: string;
        isbn: string;
    } | {
        title: string;
        isbn?: undefined;
    })[]>;
};
//# sourceMappingURL=ocr.service.d.ts.map