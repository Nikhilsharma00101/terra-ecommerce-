import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReview extends Document {
  id: string;
  author: string;
  email?: string; // High-end verification
  location: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  verified: boolean;
  productName: string;
  productSlug: string;
  helpfulCount: number;
  skinType?: string;
  avatarInitials?: string;
  isSpotlight?: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    id: { type: String, required: true, unique: true },
    author: { type: String, required: true },
    email: { type: String },
    location: { type: String, default: 'Verified Practitioner' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    date: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    verified: { type: Boolean, default: false },
    productName: { type: String, required: true },
    productSlug: { type: String, required: true },
    helpfulCount: { type: Number, default: 0 },
    skinType: { type: String },
    avatarInitials: { type: String },
    isSpotlight: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

export const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);

export default Review;
