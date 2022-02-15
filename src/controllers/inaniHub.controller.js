import { HTTP_STATUS, NOTIFICATION_TYPE } from '../common/constant';
import InaniHubService from '../services/inaniHub.service';
import { response } from '../utility/helpers';
import tokenInfo from '../utility/jwt/tokenInfo';
import notificationMessage from '../common/notificationMessage.json';

class InaniHubController {
    constructor() {
        this.inaniHubService = new InaniHubService();
    }

    paymentRelease = async (req, res) => {
        try {
            const user = tokenInfo(req, res);
            const { order_id } = req.body;

            const order = await this.inaniHubService.getOrderDetails(order_id);
            if (order) {
                const amount_release = ((order.total_price - 15 - 1.75) * 85) / 100;

                const wallet_amount = {
                    user_id: order.seller_id,
                    order_id,
                    amount: amount_release,
                    created_by: user.id,
                };

                const result = await this.inaniHubService.paymentRelease(wallet_amount);
                if (result) {
                    const notificationReq = {
                        user_id: order.seller_id,
                        title: notificationMessage?.paymentReleaseTitle,
                        description: `Order no. ${order.order_id}, $${amount_release} has been credited to wallet.`,
                        type: NOTIFICATION_TYPE?.TEXT,
                    };
                    await this.inaniHubService.addNotification(notificationReq);
                    response(res, HTTP_STATUS.SUCCESS, 'payment_release', result);
                    return;
                }
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'payment_release_bad_error');
            return;
        } catch (err) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    };
}

export default InaniHubController;
