import mongoose from 'mongoose';
var Schema = mongoose.Schema;

const BankDetailsSchema = new Schema({
    user_id: { type: mongoose.Schema.ObjectId, ref: 'users' },
    account_holder_name: { type: String },
    insitution_code: { type: String },
    transit_code: { type: String },
    account_number: { type: String },
    created_date: { type: Date, default: Date.now },
});

export default mongoose.model('bank_details', BankDetailsSchema);
