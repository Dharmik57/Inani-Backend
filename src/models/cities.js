
import mongoose from 'mongoose';
var Schema = mongoose.Schema;

const CitiesSchema = new Schema({
    city_id: { type: Number },
    name: { type: String },
    state_id: { type: Number }
});

export default mongoose.model('cities', CitiesSchema);