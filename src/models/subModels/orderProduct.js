import mongoose from 'mongoose';
var Schema = mongoose.Schema;


const OrderProduct = new Schema(
    {
        product_id: { type: mongoose.Schema.ObjectId, ref: 'products' },
        qty: { type: Number, default: 1 },
    },
    {
        versionKey: false,
        _id: false,
    }
);

export default OrderProduct
