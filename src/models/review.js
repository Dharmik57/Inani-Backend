import mongoose from 'mongoose';
var Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    product_id: { type: mongoose.Schema.ObjectId, ref: 'products' },
    user_id: { type: mongoose.Schema.ObjectId, ref: 'users' },
    seller_id: { type: mongoose.Schema.ObjectId, ref: 'users' },
    rating: { type: Number },
    comment: { type: String },
    images: { type: [String] },
    created_date: { type: Date, default: Date.now },
    created_by: { type: mongoose.Schema.ObjectId, ref: 'users' },
});

export default mongoose.model('review', ReviewSchema);
