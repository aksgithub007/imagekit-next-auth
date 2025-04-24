import mongoose, { model, models, Schema } from "mongoose";

export const videoQuality = {
  width: 1080,
  height: 1920,
} as const;

export interface VideoSchemaType {
  title: string;
  description: string;
  thumbnailUrl: string;
  fileType: string;
  fileUrl?: string;
  createdAt?: Date;
  controls?: boolean;
  updatedAt?: Date; // fixed typo: updayedAt → updatedAt
  resolution?: {
    width: number;
    height: number;
  };
  userId?: mongoose.Types.ObjectId;
}

const VideoSchema = new Schema<VideoSchemaType>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    controls: { type: Boolean, default: true },
    resolution: {
      type: Object,
      default: videoQuality, // fix: use default here
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // optional: add this if you're referencing users
      required: true,
    },
  },
  { timestamps: true }
);

// fix: model name should be singular (e.g. "Video")
export const VideoModel = models.Video || model("Video", VideoSchema);
