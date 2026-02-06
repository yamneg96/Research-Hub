export type ResearchDocument = {
  _id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  thumbnail?: string;
  coverImage?: string;
  content: string;
  pin?: string | null;
  createdAt: string;
  updatedAt: string;
};
