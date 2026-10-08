import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface IOrderAddress {
  firstName: string;
  lastName?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId;
  orderNumber: string;
  userId?: mongoose.Types.ObjectId;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  items: IOrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'Confirmation' | 'Packed' | 'Dispatched' | 'Out for delivery' | 'Delivered' | 'Cancelled';
  paymentStatus: 'Pending' | 'Processing' | 'Paid' | 'Failed' | 'Refunded';
  paymentMethod: string;
  shippingAddress: IOrderAddress;
  trackingNumber?: string;
  couponCode?: string;
  discountAmount?: number;
  createdAt: Date;
  updatedAt: Date;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  emailSent?: boolean;
  shiprocketOrderId?: number;
  shiprocketShipmentId?: number;
  awbCode?: string;
  courierName?: string;
  courierId?: number;
  shipmentStatus?: string;
  estimatedDelivery?: Date;
  labelUrl?: string;
  shiprocketPushInitiated?: boolean;
  refundFailed?: boolean;
  shiprocketCancelFailed?: boolean;
  idempotencyKey?: string;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String, required: true },
  },
  { _id: false }
);

const OrderAddressSchema = new Schema<IOrderAddress>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    address1: { type: String, required: true },
    address2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true, default: 'India' },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    customerEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerPhone: {
      type: String,
      trim: true,
    },
    items: [OrderItemSchema],
    subtotal: {
      type: Number,
      required: true,
    },
    shipping: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Confirmation', 'Packed', 'Dispatched', 'Out for delivery', 'Delivered', 'Cancelled'],
      default: 'Confirmation',
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Processing', 'Paid', 'Failed', 'Refunded'],
      default: 'Pending',
    },
    paymentMethod: {
      type: String,
      default: 'upi',
    },
    shippingAddress: {
      type: OrderAddressSchema,
      required: true,
    },
    trackingNumber: {
      type: String,
    },
    couponCode: {
      type: String,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    razorpayOrderId: {
      type: String,
      index: true,
    },
    razorpayPaymentId: {
      type: String,
    },
    emailSent: {
      type: Boolean,
      default: false,
    },
    shiprocketOrderId: { type: Number, index: true },
    shiprocketShipmentId: { type: Number },
    awbCode: { type: String, index: true },
    courierName: { type: String },
    courierId: { type: Number },
    shipmentStatus: { type: String },
    estimatedDelivery: { type: Date },
    labelUrl: { type: String },
    shiprocketPushInitiated: { type: Boolean, default: false },
    refundFailed: { type: Boolean, default: false },
    shiprocketCancelFailed: { type: Boolean, default: false },
    idempotencyKey: { type: String, unique: true, sparse: true },
  },
  {
    timestamps: true,
  }
);

export const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
