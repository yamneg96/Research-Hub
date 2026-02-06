import ResearchDocument from "../models/ResearchDocument.js";
import { uploadBuffer } from "../utils/cloudinary.js";

const hasCloudinaryConfig = () =>
  Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );

const resolveUpload = async (file, folder) => {
  if (!file) return "";
  if (!hasCloudinaryConfig()) {
    const error = new Error("Cloudinary is not configured. Please set CLOUDINARY_* in .env.");
    error.status = 500;
    throw error;
  }
  const result = await uploadBuffer(file.buffer, folder);
  return result.secure_url || "";
};

export const getResearchList = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const documents = await ResearchDocument.find(filter).sort({ updatedAt: -1 });
    res.json(documents);
  } catch (error) {
    next(error);
  }
};

export const getResearchById = async (req, res, next) => {
  try {
    const document = await ResearchDocument.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: "Research document not found" });
    }

    if (document.pin) {
      const suppliedPin = req.query.pin;
      if (!suppliedPin || suppliedPin !== document.pin) {
        return res.status(403).json({ message: "PIN required or invalid" });
      }
    }

    return res.json(document);
  } catch (error) {
    next(error);
  }
};

export const createResearch = async (req, res, next) => {
  try {
    const { title, description, category, content, pin, thumbnail, coverImage } = req.body;

    if (!title || !description || !category || !content) {
      return res.status(400).json({ message: "Title, description, category, and content are required" });
    }

    const thumbnailFile = req.files?.thumbnail?.[0] || null;
    const coverFile = req.files?.coverImage?.[0] || null;
    const uploadedThumbnail = await resolveUpload(thumbnailFile, "research-hub/thumbnails");
    const uploadedCover = await resolveUpload(coverFile, "research-hub/covers");

    const newDocument = await ResearchDocument.create({
      title,
      description,
      category,
      image: uploadedThumbnail || thumbnail || "",
      thumbnail: uploadedThumbnail || thumbnail || "",
      coverImage: uploadedCover || coverImage || "",
      content,
      pin: pin || ""
    });

    return res.status(201).json(newDocument);
  } catch (error) {
    next(error);
  }
};

export const updateResearch = async (req, res, next) => {
  try {
    const document = await ResearchDocument.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: "Research document not found" });
    }

    const { title, description, category, content, pin, thumbnail, coverImage } = req.body;
    const thumbnailFile = req.files?.thumbnail?.[0] || null;
    const coverFile = req.files?.coverImage?.[0] || null;
    const uploadedThumbnail = await resolveUpload(thumbnailFile, "research-hub/thumbnails");
    const uploadedCover = await resolveUpload(coverFile, "research-hub/covers");

    document.title = title ?? document.title;
    document.description = description ?? document.description;
    document.category = category ?? document.category;
    document.content = content ?? document.content;
    document.pin = pin ?? document.pin;
    if (uploadedThumbnail || thumbnail) {
      const nextThumbnail = uploadedThumbnail || thumbnail;
      document.thumbnail = nextThumbnail;
      document.image = nextThumbnail;
    }
    if (uploadedCover || coverImage) {
      document.coverImage = uploadedCover || coverImage;
    }

    const updated = await document.save();

    return res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteResearch = async (req, res, next) => {
  try {
    const deleted = await ResearchDocument.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Research document not found" });
    }

    return res.json({ message: "Research document deleted" });
  } catch (error) {
    next(error);
  }
};
