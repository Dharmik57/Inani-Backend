import { HTTP_STATUS, ORDER_STATUS } from '../common/constant';
import MakeOfferService from '../services/makeOffer.service';
import { response } from '../utility/helpers';
import tokenInfo from '../utility/jwt/tokenInfo';

class MakeOfferController {
    constructor() {
        this.makeOfferService = new MakeOfferService();
    }

    add = async (req, res) => {
        try {
            const user = tokenInfo(req, res);
            const request = req.body;
            request.user_id = user.id;
            const result = await this.makeOfferService.add(request);
            if (result) {
                response(res, HTTP_STATUS.SUCCESS, 'makeOffer_add', result);
            }
            if (result === null) {
                response(res, HTTP_STATUS.BAD_REQUEST, 'already_added_offer');
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'makeOffer_bad_request');
        } catch (err) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
        }
    };

    acceptDecline = async (req, res) => {
        try {
            const user = tokenInfo(req, res);
            const request = {
                ...req.body,
                notification_id: req?.params?.notification_id,
                user_id: user?.id
            };
            const result = await this.makeOfferService.acceptDecline(request);
            if (result) {
                if (req.body.status === ORDER_STATUS?.ACCEPT) {
                    response(res, HTTP_STATUS.SUCCESS, 'make_offer_accept', result);
                    return;
                } else {
                    response(res, HTTP_STATUS.SUCCESS, 'make_offer_decline', result);
                    return;
                }
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'makeOffer_bad_request');
            return;
        } catch (err) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    };

}

export default MakeOfferController;
