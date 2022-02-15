import { HTTP_STATUS } from '../common/constant';
import AddressService from '../services/address.service';
import { response } from '../utility/helpers';
import tokenInfo from '../utility/jwt/tokenInfo';

class AddressController {
    constructor() {
        this.addressService = new AddressService();
    }

    get = async (req, res) => {
        try {
            const user = tokenInfo(req, res);
            const result = await this.addressService.get(user.id);
            if (result) {
                response(res, HTTP_STATUS.SUCCESS, 'address_get', result);
                return;
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'address_bad_request');
            return;
        } catch (err) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    };

    existAddress = async (req, res) => {
        try {
            const user = tokenInfo(req, res);
            const result = await this.addressService.get(user.id);
            if (result && result.length > 0) {
                response(res, HTTP_STATUS.SUCCESS, 'address_get', true);
                return;
            }
            response(res, HTTP_STATUS.SUCCESS, 'address_get', false);
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

            if (req.body.is_default) {
                await this.addressService.setIsDefault(user.id)
            } else {
                const addressData = await this.addressService.firstAddressDefault(user.id)
                if (addressData && addressData.length === 0) {
                    request.is_default = true;
                }
            }

            const result = await this.addressService.add(request);
            if (result) {
                response(res, HTTP_STATUS.SUCCESS, 'address_add', result);
                return;
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'address_bad_request');
            return;
        } catch (err) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    };

    update = async (req, res) => {
        try {
            const user = tokenInfo(req, res);
            const id = req.params.address_id
            const request = req.body;
            if (req.body.is_default) {
                await this.addressService.setIsDefault(user.id)
            }
            const result = await this.addressService.update(id, request);
            if (result) {
                response(res, HTTP_STATUS.SUCCESS, 'address_update', result);
                return;
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'address_bad_request');
            return;
        } catch (err) {
            console.log('err', err);
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    };

    delete = async (req, res) => {
        try {
            const user = tokenInfo(req, res);
            const id = req.params.address_id;

            const result = await this.addressService.delete(id, user.id);
            if (result) {
                response(res, HTTP_STATUS.SUCCESS, 'address_delete', result);
                return;
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'address_bad_request');
            return;
        } catch (err) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    };

}

export default AddressController;
