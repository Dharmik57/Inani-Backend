import moment from 'moment';
import OrderModel from '../models/orders';
import ProductModel from '../models/products';
import NotificationModel from '../models/notification';
import UserModel from '../models/users';
import AddressModel from '../models/address';
import ReviewModel from '../models/review';
import { NOTIFICATION_TYPE } from '../common/constant';
import notificationMessage from '../common/notificationMessage.json';

class OrderService {
    checkout = (data) => {
        return OrderModel.create(data);
    };

    update = (id, data) => {
        return OrderModel.findByIdAndUpdate(id, data, { new: true });
    };

    addNotification = async (data) => {
        await data?.products?.map(async (productData) => {
            const product = await ProductModel.findById(productData?.product_id);
            if (product) {
                const input = {
                    user_id: data?.seller_id,
                    title: notificationMessage?.title.replace('{{productTitle}}', product?.name),
                    description: notificationMessage?.sellerOrderDescription,
                    price: product?.price,
                    type: NOTIFICATION_TYPE?.TEXT,
                    img: product?.images?.[0]
                };

                const notificationInput = {
                    title: notificationMessage?.userTitle.replace('{{productTitle}}', product?.name),
                    description: notificationMessage?.userDescription,
                    type: NOTIFICATION_TYPE?.TEXT,
                    user_id: data?.user_id,
                    img: product?.images?.[0]
                };
                return NotificationModel.insertMany([input, notificationInput]);
            }
        });
    };

    get = (pageLimit, skip, user_id) => {
        return new Promise((resolve) => {
            OrderModel.find({
                user_id,
            })
                .populate({
                    path: 'seller_id',
                    select: ['firstName', 'lastName', 'userName'],
                })
                .populate({
                    path: 'user_id',
                    select: ['firstName', 'lastName', 'userName'],
                })
                .populate({
                    path: 'products.product_id',
                    populate: [
                        {
                            path: 'category_id',
                            select: 'name',
                        },
                        {
                            path: 'sub_cat_id',
                            select: 'name',
                        },
                    ],
                })
                .limit(pageLimit)
                .skip(skip)
                .sort({ created_date: 'desc' })
                .exec((err, order) => {
                    if (err) {
                        console.log(err);
                    } else {
                        resolve(order);
                    }
                });
        });
    };

    getById = (order_id) => {
        return new Promise((resolve) => {
            OrderModel.findById(order_id)
                .populate({
                    path: 'seller_id',
                    select: ['firstName', 'lastName', 'userName'],
                })
                .populate({
                    path: 'user_id',
                    select: ['firstName', 'lastName', 'userName'],
                })
                .populate({
                    path: 'products.product_id',
                    populate: [
                        {
                            path: 'category_id',
                            select: 'name',
                        },
                        {
                            path: 'sub_cat_id',
                            select: 'name',
                        },
                    ],
                })
                .exec((err, order) => {
                    if (err) {
                        console.log(err);
                    } else {
                        resolve(order);
                    }
                });
        });
    };

    getCustomerAndSellerInfo = async (order_data) => {
        const { seller_id } = order_data;
        const product_id_arr = order_data.products.map((p) => p.product_id);
        const qty_arr = order_data.products.map((p) => p.qty);
        var weight = 0;
        if (product_id_arr && product_id_arr.length > 0 && qty_arr && qty_arr.length > 0) {
            const product = await ProductModel.findById(product_id_arr[0]);
            weight = parseFloat(product.weight) * parseInt(qty_arr[0]);
        }
        const customer_info = {
            ...order_data?.address,
        };

        var seller_info = await AddressModel.findOne({
            user_id: seller_id,
            is_default: true,
        });

        if (!seller_info) {
            seller_info = await AddressModel.findOne({
                user_id: seller_id,
            });
        }

        return {
            seller: seller_info,
            customer: customer_info._doc,
            weight,
        };
    };

    getSellerMail = (_id) => {
        return UserModel.findOne({
            _id,
        });
    };

    getTransactions = async (user_id) => {
        const purchrseList = await OrderModel.find({
            user_id,
        })
            .populate({
                path: 'products.product_id',
                populate: [
                    {
                        path: 'category_id',
                        select: 'name',
                    },
                    {
                        path: 'sub_cat_id',
                        select: 'name',
                    },
                ],
            })
            .sort({ created_date: 'desc' });

        const purchaseAmountArr = purchrseList.map((x) => x.total_price);
        const purchaseAmount = purchaseAmountArr.reduce(
            (partial_sum, a) => parseFloat(partial_sum) + parseFloat(a),
            0
        );

        const sellerList = await OrderModel.find({
            seller_id: user_id,
        })
            .populate({
                path: 'products.product_id',
                populate: [
                    {
                        path: 'category_id',
                        select: 'name',
                    },
                    {
                        path: 'sub_cat_id',
                        select: 'name',
                    },
                ],
            })
            .sort({ created_date: 'desc' });

        const sellerListRemoveShippingCharge = sellerList.map((x) => {
            return {
                ...x._doc,
                total_price: parseFloat(x.total_price) - 16.75
            };
        });

        const sellerAmountArr = sellerListRemoveShippingCharge.map((x) => x.total_price);
        const sellerAmount = sellerAmountArr.reduce(
            (partial_sum, a) => parseFloat(partial_sum) + parseFloat(a),
            0
        );

        const user = await UserModel.findOne(
            { _id: user_id },
            { firstName: 1, lastName: 1, createdAt: 1, image: 1 }
        );

        return {
            purchase: {
                list: purchrseList,
                amount: purchaseAmount,
            },
            seller: {
                list: sellerListRemoveShippingCharge,
                amount: sellerAmount,
            },
            ...user._doc,
        };
    };

    getProductReview = (user_id, product_id) => {
        return ReviewModel.findOne({
            user_id,
            product_id
        });
    }

    getEmailInformation = async (orderInfo) => {
        const buyerName = `${orderInfo.address?.first_name} ${orderInfo.address?.last_name}`;
        const buyerAddress = `${orderInfo.address?.address}, ${orderInfo.address?.city}, ${orderInfo.address?.state}, ${orderInfo.address?.country}, ${orderInfo.address?.postal_code}`;
        const orderDate = moment(orderInfo.ordered_date).format('MMMM DD, YYYY');

        const productInformation = await OrderModel.findOne({
            _id: orderInfo._id,
        }).populate({
            path: 'products.product_id',
        });

        const productName = productInformation && productInformation.products && productInformation.products.length > 0 && productInformation?.products[0]?.product_id?.name;

        return {
            buyerName,
            buyerAddress,
            orderDate,
            productName
        }
    }

    productQtyMinus = async (qty, _id) => {
        const productQty = await ProductModel.findOne({
            _id
        });

        await ProductModel.findByIdAndUpdate(_id, {
            qty: parseInt(productQty.qty) - parseInt(qty)
        }, { new: true });
    }

    deleteOrder = async (_id) => {
        await OrderModel.deleteOne({
            _id,
        });
    }
}

export default OrderService;
