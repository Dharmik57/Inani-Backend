import CartModel from '../models/carts';

class CartService {
    add = (data) => {
        return CartModel.create(data);
    };

    get = (user_id) => {
        return CartModel.find({
            user_id,
        });
    };

    delete = (id) => {
        return CartModel.findByIdAndDelete(id);
    };

    update = (id, data) => {
        return CartModel.findByIdAndUpdate(id, data, { new: true });
    };
}

export default CartService;
