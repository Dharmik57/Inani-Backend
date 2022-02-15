import mongoose from 'mongoose';
var Schema = mongoose.Schema;


const TrackingModel = new Schema(
    {
        date: { type: String },
        time: { type: String },
        time_zone: { type: String },
        description: { type: String },
    },
    {
        versionKey: false,
        _id: false,
    }
);

export default TrackingModel
