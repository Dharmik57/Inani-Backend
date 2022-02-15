import { HTTP_STATUS } from '../common/constant';
import UserService from '../services/user.service';
import { response } from '../utility/helpers';
import tokenInfo from '../utility/jwt/tokenInfo';

class UserController {
    constructor() {
        this.userService = new UserService();
    }

    get = async (req, res) => {
        try {
            const user = tokenInfo(req, res);
            const result = await this.userService.get(user.id);
            if (result) {
                response(res, HTTP_STATUS.SUCCESS, 'user_get', result);
                return;
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'user_bad_request');
            return;
        } catch (err) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    };

    getCountries = async (req, res) => {
        try {
            const result = await this.userService.countries();
            if (result) {
                response(res, HTTP_STATUS.SUCCESS, 'country_get', result);
                return;
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'country_bad_request');
            return;
        } catch (error) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    }

    getStates = async (req, res) => {
        try {
            const id = req?.params?.country_id
            const result = await this.userService.states(id);
            if (result) {
                response(res, HTTP_STATUS.SUCCESS, 'state_get', result);
                return;
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'state_bad_request');
            return;
        } catch (error) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    }

    getCities = async (req, res) => {
        try {
            const id = req?.params?.state_id
            const result = await this.userService.cities(id);
            if (result) {
                response(res, HTTP_STATUS.SUCCESS, 'city_get', result);
                return;
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'city_bad_request');
            return;
        } catch (error) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    }

    update = async (req, res) => {
        try {
            const user = tokenInfo(req, res);
            const fileReceivedFromClient = req.file;
            const id = user?.id;
            const request = req.body;
            request.image = `${fileReceivedFromClient.key}`;
            const result = await this.userService.update(id, request);
            if (result) {
                response(res, HTTP_STATUS.SUCCESS, 'user_update', result);
                return;
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'user_bad_request');
            return;
        } catch (err) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    };

    getDashboard = async (req, res) => {
        try {
            const user = tokenInfo(req, res);

            const result = await this.userService.getDashboard(user?.id);
            if (result) {
                response(res, HTTP_STATUS.SUCCESS, 'user_update', result);
                return;
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'user_bad_request');
            return;
        } catch (err) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    }

    getProfile = async (req, res) => {
        try {
            const id = req?.params?.user_id;
            const result = await this.userService.get(id);
            if (result) {
                response(res, HTTP_STATUS.SUCCESS, 'user_get', result);
                return;
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'user_bad_request');
            return;
        } catch (err) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    };
}

export default UserController;
