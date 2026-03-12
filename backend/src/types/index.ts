export interface PaginationQuery {
  skip?: number;
  take?: number;
  page?: number;
  limit?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CreateBookInput {
  title: string;
  author?: string;
  isbn?: string;
  notes?: string;
  shelfId?: number;
  positionIndex?: number;
}

export interface UpdateBookInput {
  title?: string;
  author?: string;
  isbn?: string;
  notes?: string;
  shelfId?: number;
  positionIndex?: number;
  status?: string;
  coverImagePath?: string;
}

export interface CreateShelfInput {
  label: string;
  sectionLetter: string;
  shelfNumber: number;
  capacity?: number;
  notes?: string;
}

export interface OcrAnalysisResult {
  extractedText: string[];
  confidence: number;
  rawText: string;
}
