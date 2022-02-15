import MakeOfferModel from '../models/makeOffer';
import NotificationModel from '../models/notification';
import ProductModel from '../models/products';
import UserModel from '../models/users';
import notificationMessage from '../common/notificationMessage.json';
import { NOTIFICATION_TYPE, ORDER_STATUS } from '../common/constant';

class MakeOfferService {
    add = async (data) => {
        const { product_id, price, user_id } = data;

        const existMakeOffer = await MakeOfferModel.findOne({
            product_id,
            customer_id: user_id,
        });

        if (!existMakeOffer) {
            const product = await ProductModel.findById(product_id);
            const customerInfo = await UserModel.findOne({
                _id: user_id
            });
            const notiInput = {
                title: notificationMessage?.makeOfferTitle.replace('{{productTitle}}', product?.name).replace('{{price}}', price).replace('{{userName}}', `@${customerInfo.userName}`),
                description: notificationMessage?.makeOfferDescription,
                price: price,
                type: NOTIFICATION_TYPE?.MAKE_OFFER,
                user_id: product?.created_by,
                img: product?.images?.[0]
            };
            const notification = await NotificationModel.create(notiInput);

            const makeOfferInput = {
                seller_id: product?.created_by,
                notification_id: notification?._id,
                customer_id: user_id,
                product_id: product?._id,
                price,
                img: product?.images?.[0]
            };
            return MakeOfferModel.create(makeOfferInput);
        }
        return null;
    };

    acceptDecline = async (data) => {
        const { notification_id, status } = data;

        const makeOffer = await MakeOfferModel.findOneAndUpdate(
            { notification_id },
            { is_offer_active: true },
            { new: true }
        );
        await NotificationModel.findByIdAndUpdate(
            notification_id,
            { type: NOTIFICATION_TYPE?.TEXT },
            { new: true }
        );
        const product = await ProductModel.findById(makeOffer?.product_id);
        const notiInput = {
            title:
                status === ORDER_STATUS.DECLINED
                    ? notificationMessage.declineOfferTitle.replace('{{price}}', makeOffer.price).replace('{{productTitle}}', product?.name)
                    : notificationMessage.acceptOfferTitle.replace('{{price}}', makeOffer.price).replace('{{productTitle}}', product?.name),
            description: status === ORDER_STATUS.DECLINED ? notificationMessage.declinedDescription : '',
            type: NOTIFICATION_TYPE?.TEXT,
            user_id: makeOffer?.customer_id,
            img: product?.images?.[0]
        };

        if (status === ORDER_STATUS.DECLINED) {
            const makeOffer = await MakeOfferModel.findOneAndUpdate(
                { notification_id },
                { is_offer_active: false },
                { new: true }
            );
        }
        return NotificationModel.create(notiInput);
    };

    filter = async (filter) => {
        return await MakeOfferModel.find(filter);
    };
}

export default MakeOfferService;
