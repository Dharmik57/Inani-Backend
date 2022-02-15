import mongoose from 'mongoose';
import { AddressSchema } from './address';
import OrderProduct from './subModels/orderProduct';
import TrackingModel from './subModels/trackingModel';
import { ORDER_STATUS, ORDER_PAYMENT_TYPE } from '../common/constant';
var Schema = mongoose.Schema;

const OrdersSchema = new Schema({
    order_id: { type: String },
    seller_id: { type: mongoose.Schema.ObjectId, ref: 'users' },
    user_id: { type: mongoose.Schema.ObjectId, ref: 'users' },
    transaction_id: { type: String },
    products: [OrderProduct],
    items_price: { type: Number },
    wallet_amount: { type: Number },
    is_wallet_amount_used: { type: Boolean },
    shipping_charge: { type: Number },
    expected_date_of_delivery: { type: Date },
    gst_tax: { type: Number },
    total_price: { type: Number },
    payment_method: {
        type: String,
        enum: [ORDER_PAYMENT_TYPE.COD, ORDER_PAYMENT_TYPE.STRIPE],
    },
    address: { type: AddressSchema },
    status: {
        type: String,
        enum: [
            ORDER_STATUS.ORDERED,
            ORDER_STATUS.ACCEPT,
            ORDER_STATUS.DECLINED,
            ORDER_STATUS.PACKED,
            ORDER_STATUS.SHIPPED,
            ORDER_STATUS.DELIVERY,
            ORDER_STATUS.DELIVERED,
            ORDER_STATUS.COMPLETED,
        ],
        default: ORDER_STATUS.ORDERED,
    },
    ordered_date: { type: Date, default: Date.now },
    declined_date: { type: Date, default: null },
    declined_by: { type: String },
    created_date: { type: Date, default: Date.now },
    is_payment_success: { type: Boolean, default: false },
    is_payment_release_to_seller: { type: Boolean, default: false },
    shipping_canada_post_id: { type: String },
    shipping_tracking_id: { type: String },
    shipping_label_to_seller: { type: String },
    shipping_tracking: [TrackingModel],
    expected_delivery_date: { type: String },
    is_delivered: { type: Boolean, default: false },
});

export default mongoose.model('orders', OrdersSchema);
