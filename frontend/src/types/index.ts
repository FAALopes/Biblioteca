export interface Book {
  id: number;
  title: string;
  author?: string;
  isbn?: string;
  coverImagePath?: string;
  notes?: string;
  shelfId?: number;
  positionIndex?: number;
  status: string;
  statusUpdatedAt: string;
  createdAt: string;
  updatedAt: string;
  shelf?: Shelf;
}

export interface Shelf {
  id: number;
  label: string;
  sectionLetter: string;
  shelfNumber: number;
  capacity?: number;
  notes?: string;
  books?: Book[];
  _count?: {
    books: number;
  };
}

export interface Photo {
  id: number;
  filePath: string;
  uploadedAt: string;
  bookId?: number;
  metadata?: any;
  ocrResults?: OcrResult[];
}

export interface OcrResult {
  id: number;
  photoId: number;
  bookId?: number;
  extractedTitle?: string;
  extractedAuthor?: string;
  extractedIsbn?: string;
  confidence?: number;
  rawText?: string;
  processedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ListResponse<T> {
  success: boolean;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
  };
}
