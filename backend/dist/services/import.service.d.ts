interface ExcelRow {
    [key: string]: any;
}
interface ImportResult {
    successCount: number;
    errorCount: number;
    skippedCount: number;
    errors: Array<{
        row: number;
        error: string;
    }>;
    newBooks: Array<{
        title: string;
        author?: string;
        isbn?: string;
    }>;
}
export declare const importService: {
    parseExcelFile(filePath: string): Promise<ExcelRow[]>;
    detectColumns(rows: ExcelRow[]): Promise<{
        titleCol: string | null;
        authorCol: string | null;
        isbnCol: string | null;
        locationCol: string | null;
    }>;
    mergeExcelData(rows: ExcelRow[], columnMapping: {
        titleCol: string | null;
        authorCol: string | null;
        isbnCol: string | null;
        locationCol: string | null;
    }): Promise<ImportResult>;
};
export {};
//# sourceMappingURL=import.service.d.ts.map