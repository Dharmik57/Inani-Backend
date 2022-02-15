import mongoose from 'mongoose';
var Schema = mongoose.Schema;

const CommentSchema = new Schema({
    product_id: { type: mongoose.Schema.ObjectId, ref: 'products' },
    user_id: { type: mongoose.Schema.ObjectId, ref: 'users' },
    comment: { type: String },
    created_date: { type: Date, default: Date.now },
    created_by: { type: mongoose.Schema.ObjectId, ref: 'users' },
});

export default mongoose.model('comment', CommentSchema);