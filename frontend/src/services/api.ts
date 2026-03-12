import axios, { AxiosInstance } from "axios";
import { Book, Shelf } from "../types";

const api: AxiosInstance = axios.create({
  baseURL: "/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use((config) => {
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error || error.message || "Erro na requisição";
    console.error("[API Error]", message);
    return Promise.reject(error);
  }
);

// Books
export const booksAPI = {
  list: (params?: any) =>
    api.get<any>("/books", { params }).then((res) => res.data.data),
  get: (id: number) => api.get<any>(`/books/${id}`).then((res) => res.data.data),
  create: (data: Partial<Book>) =>
    api.post<any>("/books", data).then((res) => res.data.data),
  update: (id: number, data: Partial<Book>) =>
    api.put<any>(`/books/${id}`, data).then((res) => res.data.data),
  delete: (id: number) =>
    api.delete(`/books/${id}`).then((res) => res.data),
  getStats: () =>
    api.get<any>("/books/stats").then((res) => res.data.data),
};

// Shelves
export const shelvesAPI = {
  list: () => api.get<any>("/shelves").then((res) => res.data.data),
  get: (id: number) =>
    api.get<any>(`/shelves/${id}`).then((res) => res.data.data),
  create: (data: Partial<Shelf>) =>
    api.post<any>("/shelves", data).then((res) => res.data.data),
  update: (id: number, data: Partial<Shelf>) =>
    api.put<any>(`/shelves/${id}`, data).then((res) => res.data.data),
  delete: (id: number) =>
    api.delete(`/shelves/${id}`).then((res) => res.data),
};

// Photos
export const photosAPI = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post<any>("/photos", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then((res) => res.data.data);
  },
  list: (params?: any) =>
    api.get<any>("/photos", { params }).then((res) => res.data.data),
  delete: (id: number) =>
    api.delete(`/photos/${id}`).then((res) => res.data),
};

// OCR
export const ocrAPI = {
  analyze: (photoId: number) =>
    api.post<any>("/ocr/analyze", { photoId }).then((res) => res.data.data),
  pending: () =>
    api.get<any>("/ocr/pending").then((res) => res.data.data),
};

// Import
export const importAPI = {
  uploadExcel: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post<any>("/import/excel", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then((res) => res.data.data);
  },
  merge: (data: any) =>
    api.post<any>("/import/excel/merge", data).then((res) => res.data.data),
  logs: () =>
    api.get<any>("/import/logs").then((res) => res.data.data),
};

export default api;
