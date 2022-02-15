import { HTTP_STATUS } from '../common/constant';
import SubCategoryService from '../services/subCategory.service';
import { response } from '../utility/helpers';

class SubCategoryController {
    constructor() {
        this.subCategoryService = new SubCategoryService();
    }

    add = async (req, res) => {
        try {
            const request = req.body;
            const result = await this.subCategoryService.add(request);
            if (result) {
                response(res, HTTP_STATUS.SUCCESS, 'sub_category_add', result);
                return;
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'sub_category_bad_request');
            return;
        } catch (err) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    };

    get = async (req, res) => {
        try {
            const result = await this.subCategoryService.get();
            if (result) {
                response(res, HTTP_STATUS.SUCCESS, 'sub_category_get', result);
                return;
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'sub_category_bad_request');
            return;
        } catch (err) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    };
}

export default SubCategoryController;
