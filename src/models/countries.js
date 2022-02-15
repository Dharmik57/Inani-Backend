import mongoose from 'mongoose';
var Schema = mongoose.Schema;

const CountriesSchema = new Schema({
    country_id: { type: Number },
    name: { type: String },
    sortname: { type: String },
    tele_code: { type: String },
    currency: { type: String },
    currency_symbol: { type: String },
    region: { type: String },
    subregion: { type: String }
});

export default mongoose.model('countrie', CountriesSchema);