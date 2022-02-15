import mongoose from 'mongoose';
import { AMOUNT_TYPE } from '../common/constant';
var Schema = mongoose.Schema;

const WalletSchema = new Schema({
    order_id: { type: mongoose.Schema.ObjectId, ref: 'orders' },
    user_id: { type: mongoose.Schema.ObjectId, ref: 'users' },
    amount: { type: Number },
    amount_type: {
        type: String,
        enum: [
            AMOUNT_TYPE.CREDIT,
            AMOUNT_TYPE.DEBIT,
        ],
        default: AMOUNT_TYPE.CREDIT,
    },
    created_date: { type: Date, default: Date.now },
    created_by: { type: mongoose.Schema.ObjectId, ref: 'users' },
});

export default mongoose.model('wallet', WalletSchema);
