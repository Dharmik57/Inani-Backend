
import mongoose from 'mongoose';
var Schema = mongoose.Schema;

const StateSchema = new Schema({
    state_id: { type: Number },
    name: { type: String },
    country_id: { type: Number },
    state_code: { type: String }
});

export default mongoose.model('state', StateSchema);