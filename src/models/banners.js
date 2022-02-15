import mongoose from 'mongoose';
var Schema = mongoose.Schema;

const BannerSchema = new Schema({
    title: { type: String },
    image: { type: String },
    isActive: { type: Boolean, default: true },
    created_date: { type: Date, default: Date.now },
    created_by: { type: mongoose.Schema.ObjectId, ref: 'users' },
});

export default mongoose.model('banners', BannerSchema);
