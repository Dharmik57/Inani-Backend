import { HTTP_STATUS } from '../common/constant';
import BannerService from '../services/banner.service';
import { response } from '../utility/helpers';

class BannerController {
    constructor() {
        this.bannerService = new BannerService();
    }

    addBanner = async (req, res) => {
        try {
            const fileRecievedFromClient = req.file;
            const request = req.body;
            request.image = `${fileRecievedFromClient.key}`;
            const result = await this.bannerService.addBanner(request);
            if (result) {
                response(res, HTTP_STATUS.SUCCESS, 'banner_uploaded', result);
                return;
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'banner_not_uploaded');
            return;
        } catch (err) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    };

    getBanners = async (req, res) => {
        try {
            const banners = await this.bannerService.getBanner()

            if (banners) {
                response(res, HTTP_STATUS.SUCCESS, 'banner_get', banners);
                return;
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'banner_bad_request');
            return;
        } catch (error) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    }
}

export default BannerController;
