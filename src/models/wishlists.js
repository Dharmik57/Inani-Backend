import mongoose from 'mongoose';
var Schema = mongoose.Schema;

const WishlistSchema = new Schema({
    user_id: { type: mongoose.Schema.ObjectId, ref: 'users' },
    product_id: { type: mongoose.Schema.ObjectId, ref: 'products' },
    created_date: { type: Date, default: Date.now },
});

export default mongoose.model('wishlists', WishlistSchema);
