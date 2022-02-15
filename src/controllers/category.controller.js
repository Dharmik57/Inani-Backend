import { HTTP_STATUS } from '../common/constant';
import CategoryService from '../services/category.service';
import { response } from '../utility/helpers';

class CategoryController {
    constructor() {
        this.categoryService = new CategoryService();
    }

    add = async (req, res) => {
        try {
            const request = req.body;
            const result = await this.categoryService.add(request);
            if (result) {
                response(res, HTTP_STATUS.SUCCESS, 'category_add', result);
                return;
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'category_bad_request');
            return;
        } catch (err) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    };

    get = async (req, res) => {
        try {
            const result = await this.categoryService.get();
            if (result) {
                response(res, HTTP_STATUS.SUCCESS, 'category_get', result);
                return;
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'category_bad_request');
            return;
        } catch (err) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    };
}

export default CategoryController;
