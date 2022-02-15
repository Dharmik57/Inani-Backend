import mongoose from 'mongoose';
import WishlistModel from '../models/wishlists';

class WishlistService {
    add = (data) => {
        return WishlistModel.create(data);
    };

    get = (user_id) => {
        return WishlistModel.find({ user_id }).populate({
            path: 'product_id',
        });
    };

    getByID = (user_id, product_id) => {
        return WishlistModel.findOne({ user_id, product_id });
    }

    getByFilter = (filter) => {
        return WishlistModel.find(filter);
    };

    delete = (product_id, user_id) => {
        return WishlistModel.find({
            product_id: new mongoose.Types.ObjectId(product_id),
            user_id: new mongoose.Types.ObjectId(user_id),
        })
            .remove()
            .exec();
    };
}

export default WishlistService;
