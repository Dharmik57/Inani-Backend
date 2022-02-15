import { ORDER_STATUS } from '../common/constant';
import OrderModel from '../models/orders';
import WalletModel from '../models/wallet';
import NotificationModel from '../models/notification';

class AddressService {
    getOrderDetails = async (_id) => {
        await OrderModel.findByIdAndUpdate(_id, {
            is_payment_release_to_seller: true
        }, { new: true })

        return OrderModel.findOne({
            _id
        });
    }

    paymentRelease = (data) => {
        return WalletModel.create(data);
    };

    addNotification = (data) => {
        return NotificationModel.create(data);
    }
}

export default AddressService;
