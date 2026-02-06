import api from "./client";
import type { ResearchDocument } from "../types";

export const fetchResearchList = async (category?: string) => {
  const params = category && category !== "All" ? { category } : {};
  const response = await api.get<ResearchDocument[]>("/api/research", { params });
  return response.data;
};

export const fetchResearchById = async (id: string, pin?: string) => {
  const params = pin ? { pin } : {};
  const response = await api.get<ResearchDocument>(`/api/research/${id}`, { params });
  return response.data;
};

export const createResearch = async (payload: FormData) => {
  const response = await api.post<ResearchDocument>("/api/research", payload, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response.data;
};

export const updateResearch = async (id: string, payload: FormData) => {
  const response = await api.put<ResearchDocument>(`/api/research/${id}`, payload, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response.data;
};

export const deleteResearch = async (id: string) => {
  const response = await api.delete<{ message: string }>(`/api/research/${id}`);
  return response.data;
};
