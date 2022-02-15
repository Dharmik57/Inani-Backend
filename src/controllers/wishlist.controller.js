import { HTTP_STATUS } from '../common/constant';
import WishlistService from '../services/wishlist.service';
import { response } from '../utility/helpers';
import tokenInfo from '../utility/jwt/tokenInfo';

class WishlistController {
    constructor() {
        this.wishlistService = new WishlistService();
    }

    get = async (req, res) => {
        try {
            const user = tokenInfo(req, res);
            const result = await this.wishlistService.get(user.id);
            if (result) {
                response(res, HTTP_STATUS.SUCCESS, 'wishlist_get', result);
                return;
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'wishlist_bad_request');
            return;
        } catch (err) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    };

    add = async (req, res) => {
        try {
            const user = tokenInfo(req, res);
            const request = req.body;
            request.user_id = user.id;
            const isExist = await this.wishlistService.getByID(user.id, request.product_id);
            if (isExist) {
                response(res, HTTP_STATUS.SUCCESS, 'wishlist_already_exist', isExist);
                return;
            }
            const result = await this.wishlistService.add(request);
            if (result) {
                response(res, HTTP_STATUS.SUCCESS, 'wishlist_add', result);
                return;
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'wishlist_bad_request');
            return;
        } catch (err) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    };

    delete = async (req, res) => {
        const id = req.params.product_id
        const user = tokenInfo(req, res);
        try {
            const result = await this.wishlistService.delete(id, user.id);
            if (result) {
                response(res, HTTP_STATUS.SUCCESS, 'wishlist_delete', result);
                return;
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'wishlist_bad_request');
            return;
        } catch (err) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    };

}

export default WishlistController;
