import axios from 'axios';
import { ORDER_STATUS } from '../common/constant';
import CANADA_POST from '../config/delivery.config';
import OrderModel from '../models/orders';
import { xmlToJson } from '../utility/helpers';

const orderTracking = async () => {
    try {
        const orderDetails = await OrderModel.find({
            is_delivered: false
        });

        for (let i = 0; i < orderDetails.length; i++) {

            const order = orderDetails[i];

            var config = {
                method: 'GET',
                url: `https://ct.soa-gw.canadapost.ca/vis/track/pin/${order.shipping_tracking_id}/details`,
                // url: `https://ct.soa-gw.canadapost.ca/vis/track/pin/1371134583769923/details`,
                headers: {
                    'Authorization': CANADA_POST.TOKEN,
                    'Accept': 'application/vnd.cpc.track-v2+xml',
                    'Accept-language': 'en-CA',
                }
            };

            const result = await axios(config);

            if (result) {
                const obj = await xmlToJson(result.data);
                const tracking_details = obj['tracking-detail'];
                const expected_delivery_date = tracking_details['expected-delivery-date'][0];
                const significant_event = tracking_details['significant-events'][0];
                const tracking_arr = significant_event['occurrence'];

                const tracking_detail_arr = [];
                tracking_arr.forEach((track) => {
                    const newTrack = {
                        date: track['event-date'][0],
                        time: track['event-time'][0],
                        time_zone: track['event-time-zone'][0],
                        description: track['event-description'][0],
                    }
                    tracking_detail_arr.push(newTrack);
                });

                let is_delivered = false;
                if (tracking_detail_arr.length > 0) {
                    is_delivered = tracking_detail_arr[0].description === 'Item successfully delivered';
                }

                await OrderModel.findByIdAndUpdate(
                    order._id,
                    { shipping_tracking: tracking_detail_arr, expected_delivery_date, is_delivered, status: is_delivered ? ORDER_STATUS.DELIVERED : ORDER_STATUS.DELIVERY },
                    { new: true }
                );
            }
        }
    } catch (err) {
        console.log('err', err);
    }
}

export default orderTracking;
