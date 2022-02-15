import OrderService from '../services/order.service';
import { response, xmlToJson } from '../utility/helpers';
import Randomstring from 'randomstring';
import { AMOUNT_TYPE, HTTP_STATUS, NOTIFICATION_TYPE, ORDER_STATUS } from '../common/constant';
import tokenInfo from '../utility/jwt/tokenInfo';
import { sendNotification } from '../helper/sendNotification';
import notificationMessage from '../common/notificationMessage.json';
import ProductService from '../services/product.service';
import NotificationService from '../services/notification.service';
import CanadaPostService from '../services/canadaPost.service';
import InaniHubService from '../services/inaniHub.service';
import { sendEmail } from '../utility/mailer';

var order = null;
class OrderController {
    constructor() {
        this.orderService = new OrderService();
        this.productService = new ProductService();
        this.notificationService = new NotificationService();
        this.canadaPostService = new CanadaPostService();
        this.inaniHubService = new InaniHubService();
    }

    checkout = async (req, res) => {
        try {
            const user = tokenInfo(req, res);
            var request = req.body;
            request.order_id = Randomstring.generate(8).toUpperCase();
            request.transaction_id = Randomstring.generate({ length: 10, charset: 'numeric' });
            request.user_id = user.id;

            order = await this.orderService.checkout(request);

            if (order) {

                await this.orderService.productQtyMinus(order && order.products.length > 0 && order.products[0].qty, order && order.products.length > 0 && order.products[0].product_id);

                // If wallet amount use on checkout
                if (request.is_wallet_amount_used) {
                    const wallet_amount = {
                        user_id: user.id,
                        order_id: order._id,
                        amount: request.wallet_amount,
                        created_by: user.id,
                        amount_type: AMOUNT_TYPE.DEBIT
                    };
                    await this.inaniHubService.paymentRelease(wallet_amount);
                }

                await this.orderService.addNotification(order);

                const delivery_obj = await this.orderService.getCustomerAndSellerInfo(order);

                // Canada post request to pickup the order from seller and deliver to customer
                const deliveryServiceResponse = await this.canadaPostService.createShipment(
                    delivery_obj.seller,
                    delivery_obj.customer,
                    delivery_obj.weight
                );

                if (deliveryServiceResponse) {
                    const jsonResponse = await xmlToJson(deliveryServiceResponse);
                    const contract_info = jsonResponse['non-contract-shipment-info'];
                    const shipment_id = contract_info['shipment-id']?.[0];
                    const tracking_id = contract_info['tracking-pin']?.[0];
                    const linkArr = contract_info?.links?.[0]?.link;
                    const label_url_arr = linkArr?.filter((link) => link.$.rel === 'label');
                    var label_url = '';
                    if (label_url_arr && label_url_arr.length > 0) {
                        label_url = label_url_arr[0]?.$.href;
                    }
                    await this.orderService.update(order._id, {
                        shipping_canada_post_id: shipment_id,
                        shipping_tracking_id: tracking_id,
                        shipping_label_to_seller: label_url,
                    });

                    const seller_info = await this.orderService.getSellerMail(order.seller_id);

                    const seller_label_inforamtion = await this.orderService.getEmailInformation(order);

                    await this.canadaPostService.getLabelFromCanadaPost(
                        label_url,
                        shipment_id,
                        seller_info.email,
                        `${seller_info.firstName} ${seller_info.lastName}`,
                        seller_label_inforamtion.productName,
                        seller_label_inforamtion.orderDate,
                        seller_label_inforamtion.buyerName,
                        seller_label_inforamtion.buyerAddress
                    );
                }

                response(res, HTTP_STATUS.SUCCESS, 'order_create', order);
                return;
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'order_bad_request', order);
            return;
        } catch (error) {
            await this.orderService.deleteOrder(order._id);
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    };

    get = async (req, res) => {
        try {
            const user = tokenInfo(req, res);
            const { skip, pageLimit } = req.body;
            const orders = await this.orderService.get(pageLimit, skip, user.id);

            if (orders) {
                response(res, HTTP_STATUS.SUCCESS, 'order_get', orders);
                return;
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'order_bad_request', orders);
            return;
        } catch (error) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    };

    getById = async (req, res) => {
        try {
            const __condtition = {
                _id: req.query.id,
            };
            const user = tokenInfo(req, res);

            const order = await this.orderService.getById(req.params.id);
            const product_id = order?.products && order?.products.length > 0 && order?.products[0] && order?.products[0]?.product_id?._id;
            const product_review = await this.orderService.getProductReview(user.id, product_id);

            if (product_review) {
                order._doc['product_review'] = true;
            } else {
                order._doc['product_review'] = false;
            }

            if (order) {
                response(res, HTTP_STATUS.SUCCESS, 'order_get', order);
                return;
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'order_bad_request', order);
            return;
        } catch (error) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    };

    // update = async (req, res) => {
    //     try {
    //         const user = tokenInfo(req, res);
    //         const id = req.params.id;
    //         const request = req.body;

    //         const result = await this.orderService.update(id, request);

    //         const data = {
    //             title:
    //                 request.status === ORDER_STATUS.ACCEPT
    //                     ? notificationMessage?.orderAccept
    //                     : notificationMessage?.orderDecline,
    //             user_id: result?.user_id,
    //             price: result?.total_price,
    //             order_id: result?._id,
    //         };

    //         await this.notificationService.updateOrderToText(id);

    //         if (result) {
    //             await result?.products?.map(async (product) => {
    //                 const productData = await this.productService.getById({
    //                     _id: product?.product_id,
    //                 });
    //                 data.description = productData?.name;
    //                 await sendNotification(data);
    //             });
    //             response(res, HTTP_STATUS.SUCCESS, 'order_update', result);
    //         }
    //         response(res, HTTP_STATUS.BAD_REQUEST, 'order_bad_request');
    //     } catch (err) {
    //         response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
    //     }
    // };

    getTransactions = async (req, res) => {
        try {
            const user = tokenInfo(req, res);

            const order = await this.orderService.getTransactions(user.id);
            if (order) {
                response(res, HTTP_STATUS.SUCCESS, 'transaction_list', order);
                return;
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'transaction_bad_request', order);
            return;
        } catch (error) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    };
}

export default OrderController;
