import mongoose from 'mongoose';
var Schema = mongoose.Schema;

export const AddressSchema = new Schema({
    user_id: { type: mongoose.Schema.ObjectId, ref: 'users' },
    first_name: { type: String },
    last_name: { type: String },
    address: { type: String },
    city: { type: String },
    postal_code: { type: String },
    state: { type: String },
    country: { type: String },
    state_code: { type: String },
    country_code: { type: String },
    phone_number: { type: String },
    is_default: { type: Boolean, default: false },
    created_date: { type: Date, default: Date.now },
    created_by: { type: mongoose.Schema.ObjectId, ref: 'users' },
    updated_date: { type: Date, default: Date.now },
    updated_by: { type: mongoose.Schema.ObjectId, ref: 'users' },
});

export default mongoose.model('address', AddressSchema);
