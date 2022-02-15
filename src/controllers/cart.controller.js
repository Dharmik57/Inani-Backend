import { HTTP_STATUS } from '../common/constant';
import CartService from '../services/cart.service';
import { response } from '../utility/helpers';
import tokenInfo from '../utility/jwt/tokenInfo';

class CartController {
    constructor() {
        this.cartService = new CartService();
    }

    get = async (req, res) => {
        try {
            const user = tokenInfo(req, res);
            const result = await this.cartService.get(user.id);
            if (result) {
                response(res, HTTP_STATUS.SUCCESS, 'cart_get', result);
                return;
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'cart_bad_request');
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
            const result = await this.cartService.add(request);
            if (result) {
                response(res, HTTP_STATUS.SUCCESS, 'cart_add', result);
                return;
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'cart_bad_request');
            return;
        } catch (err) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    };

    update = async (req, res) => {
        try {
            const user = tokenInfo(req, res);
            const id = req.params.product_id
            const request = req.body;
            request.user_id = user.id;

            const result = await this.cartService.update(id, request);
            if (result) {
                response(res, HTTP_STATUS.SUCCESS, 'cart_update', result);
                return;
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'cart_bad_request');
            return;
        } catch (err) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    };

    delete = async (req, res) => {
        try {
            const id = req.params.product_id
            const result = await this.cartService.delete(id);
            if (result) {
                response(res, HTTP_STATUS.SUCCESS, 'cart_delete', result);
                return;
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'cart_bad_request');
            return;
        } catch (err) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    };

}

export default CartController;
