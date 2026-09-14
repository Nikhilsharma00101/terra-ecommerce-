import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUserAddress {
  id?: string;
  title?: string;
  fullName?: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

export interface IUserSubscription {
  status: 'active' | 'paused' | 'cancelled';
  frequency: '30d' | '60d' | '90d';
  nextDispatchDate?: Date;
  productSlug?: string;
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
  phone?: string;
  tier: string;
  wishlist: string[];
  subscription: IUserSubscription;
  addresses: IUserAddress[];
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<IUserAddress>(
  {
    id: { type: String },
    title: { type: String, default: 'Home' },
    fullName: { type: String },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true, default: 'Maharashtra' },
    postalCode: { type: String, required: true },
    country: { type: String, required: true, default: 'India' },
    phone: { type: String },
    isDefault: { type: Boolean, default: false },
  },
  { _id: false }
);

const SubscriptionSchema = new Schema<IUserSubscription>(
  {
    status: { type: String, enum: ['active', 'paused', 'cancelled'], default: 'active' },
    frequency: { type: String, enum: ['30d', '60d', '90d'], default: '60d' },
    nextDispatchDate: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
    productSlug: { type: String, default: 'the-method' },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Do not return password by default
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    phone: {
      type: String,
      trim: true,
    },
    tier: {
      type: String,
      default: 'Terra Club Member',
    },
    wishlist: {
      type: [String],
      default: [],
    },
    subscription: {
      type: SubscriptionSchema,
      default: () => ({
        status: 'active',
        frequency: '60d',
        nextDispatchDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        productSlug: 'the-method',
      }),
    },
    addresses: [AddressSchema],
  },
  {
    timestamps: true,
  }
);

// Prevent re-compiling model in Next.js hot reload
export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
