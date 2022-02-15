import mongoose from 'mongoose';
var Schema = mongoose.Schema;

const SubCategorySchema = new Schema({
    cat_id: { type: String },
    name: { type: String },
    img: { type: String },
    size: { type: [String] },
    isActive: { type: Boolean },
});

export default mongoose.model('sub_category', SubCategorySchema);
