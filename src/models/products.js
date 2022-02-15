import mongoose from 'mongoose';
// require('mongoose-double')(mongoose);
var Schema = mongoose.Schema;

const ProductSchema = new Schema({
    category_id: { type: mongoose.Schema.ObjectId, ref: 'categories' },
    sub_cat_id: { type: mongoose.Schema.ObjectId, ref: 'sub_category' },
    brand: { type: String },
    size: { type: String },
    description: { type: String },
    price: { type: Number },
    discount_price: { type: Number },
    your_earning: { type: Number },
    final_price: { type: Number },
    condition: { type: String },
    images: { type: [String] },
    wishlist: { type: Boolean },
    name: { type: String },
    color: { type: String },
    year: { type: String },
    product_code: { type: String },
    products: [{ type: mongoose.Schema.ObjectId, ref: 'products' }],
    is_active: { type: Boolean, default: true },
    is_bundled_product: { type: Boolean, default: false },
    make_offer: { type: Boolean, default: false },
    created_date: { type: Date, default: Date.now },
    created_by: { type: mongoose.Schema.ObjectId, ref: 'users' },
    modified_date: { type: Date, default: Date.now },
    modified_by: { type: mongoose.Schema.ObjectId, ref: 'users' },
    weight: { type: Number },
    qty: { type: Number },
});

export default mongoose.model('products', ProductSchema);
