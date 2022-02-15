import mongoose from 'mongoose';
var Schema = mongoose.Schema;

const MakeOfferSchema = new Schema({
    seller_id: { type: mongoose.Schema.ObjectId, ref: 'users' },
    notification_id: { type: mongoose.Schema.ObjectId, ref: 'notification' },
    customer_id: { type: mongoose.Schema.ObjectId, ref: 'users' },
    product_id: { type: mongoose.Schema.ObjectId, ref: 'products' },
    price: { type: Number },
    is_offer_active: { type: Boolean, default: false },
    created_date: { type: Date, default: Date.now }
});

export default mongoose.model('makeOffer', MakeOfferSchema);