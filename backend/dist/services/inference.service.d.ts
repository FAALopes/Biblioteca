interface InferenceResult {
    shelfId: number | null;
    confidence: number;
    reasoning: string;
}
export declare const inferenceService: {
    inferShelfPosition(bookId: number): Promise<InferenceResult>;
    suggestPositionIndex(shelfId: number): Promise<number>;
};
export {};
//# sourceMappingURL=inference.service.d.ts.map