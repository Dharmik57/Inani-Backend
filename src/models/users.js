import mongoose from 'mongoose';
var Schema = mongoose.Schema;

const UsersSchema = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    userName: { type: String },
    password: { type: String },
    email: { type: String },
    image: { type: String },
    views: { type: Number, default: 0 },
    saved: { type: Number },
    isActive: { type: Boolean, default: true },
    strip_customer_id: { type: String },
    app_device_id: { type: String },
    device_type: { type: String },
    created_date: { type: Date, default: Date.now },
    updated_date: { type: Date },
    socialMediaType: { type: String },
    loginID: { type: String },
});

export default mongoose.model('users', UsersSchema);
