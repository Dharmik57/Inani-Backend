import { HTTP_STATUS } from '../common/constant';
import FilterService from '../services/filter.service';
import { response } from '../utility/helpers';
import tokenInfo from '../utility/jwt/tokenInfo';

class FilterController {
    constructor() {
        this.filterService = new FilterService();
    }

    get = async (req, res) => {
        try {
            const result = await this.filterService.get();
            if (result) {
                response(res, HTTP_STATUS.SUCCESS, 'filter_get', result);
                return;
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'filter_bad_request');
            return;
        } catch (err) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    };

    getBrands = async (req, res) => {
        try {
            const brands = await this.filterService.getBrands()

            if (brands) {
                response(res, HTTP_STATUS.SUCCESS, 'brands_get', brands);
                return;
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'brands_bad_request');
            return;
        } catch (error) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    }
}

export default FilterController;
