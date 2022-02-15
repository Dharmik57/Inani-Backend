import mongoose from 'mongoose';
var Schema = mongoose.Schema;

const CartSchema = new Schema({
    user_id: { type: mongoose.Schema.ObjectId, ref: 'users' },
    product_id: { type: mongoose.Schema.ObjectId, ref: 'products' },
    qty: { type: Number },
    created_date: { type: Date, default: Date.now },
    updated_date: { type: Date },
});

export default mongoose.model('carts', CartSchema);
