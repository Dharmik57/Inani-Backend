import { HTTP_STATUS } from '../common/constant';
import CANADA_POST from '../config/delivery.config';
import CanadaPostService from '../services/canadaPost.service';
import { response, xmlToJson } from '../utility/helpers';
import tokenInfo from '../utility/jwt/tokenInfo';

class CanadaPostController {
    constructor() {
        this.canadaPostService = new CanadaPostService();
    }

    getDeliveryCharge = async (req, res) => {
        try {
            // const user = tokenInfo(req, res);
            const { body } = req;
            const { seller_code, customer_code } = body;
            const weight = '1';
            const result = await this.canadaPostService.getDeliveryCharge(
                seller_code,
                customer_code,
                weight
            );
            if (result) {
                const obj = await xmlToJson(result);
                const price_quotes = obj['price-quotes']['price-quote'];
                const service_provider = price_quotes.filter((p) =>
                    p['service-code'].includes(CANADA_POST.SERVICE_CODE)
                );
                if (service_provider && service_provider.length === 1) {
                    const service = service_provider[0];
                    const delivery_response = {
                        expected_delivery_date:
                            service['service-standard']?.[0]?.['expected-delivery-date']?.[0],
                        price: service['price-details']?.[0]?.['due']?.[0],
                    };
                    response(res, HTTP_STATUS.SUCCESS, 'delivery_details', delivery_response);
                    return;
                }
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'delivery_error');
            return;
        } catch (err) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    };
}

export default CanadaPostController;
