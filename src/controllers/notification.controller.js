
import moment from 'moment';
import { HTTP_STATUS } from '../common/constant';
import { sendNotification } from '../helper/sendNotification';
import NotificationService from '../services/notification.service';
import { response } from '../utility/helpers';
import tokenInfo from '../utility/jwt/tokenInfo';

class NotificationController {
    constructor() {
        this.notificationService = new NotificationService();
    }

    get = async (req, res) => {
        try {
            const user = tokenInfo(req, res);
            const result = await this.notificationService.get(user?.id);

            const groups = result.reduce((groups, obj) => {
                const date = moment(obj.created_date).format('DD-MM-YYYY');
                if (!groups[date]) {
                    groups[date] = [];
                }
                groups[date].push(obj);
                return groups;
            }, {});

            // Edit: to add it in the array format instead
            const groupArrays = Object.keys(groups).map((date) => {
                const today = moment().format('DD-MM-YYYY');
                const yesterday = moment().subtract(1, 'day').format('DD-MM-YYYY');

                return {
                    title: date === today ? 'Today' : date === yesterday ? 'Yesterday' : date,
                    notifications: groups[date]
                };
            });

            if (groupArrays) {
                response(res, HTTP_STATUS.SUCCESS, 'notification_get', groupArrays);
                return;
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'notification_bad_request');
            return;
        } catch (err) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    };

    allVisible = async (req, res) => {
        try {
            const user = tokenInfo(req, res);
            const result = await this.notificationService.allVisible(user?.id);
            if (result) {
                response(res, HTTP_STATUS.SUCCESS, 'notification_update', result);
                return;
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'notification_bad_request');
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

            const result = await sendNotification(request);
            if (result) {
                response(res, HTTP_STATUS.SUCCESS, 'notification_add', result);
                return;
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'notification_bad_request');
            return;
        } catch (err) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    };

    update = async (req, res) => {
        try {
            const user = tokenInfo(req, res);
            const id = req.params.id

            const result = await this.notificationService.update(id);
            if (result) {
                response(res, HTTP_STATUS.SUCCESS, 'notification_update', result);
                return;
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'notification_bad_request');
            return;
        } catch (err) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    };

    getNonVisibleNotificationCount = async (req, res) => {
        try {
            const user = tokenInfo(req, res);

            const result = await this.notificationService.getNonVisibleNotificationCount(user.id);
            if (result) {
                response(res, HTTP_STATUS.SUCCESS, 'notification_count', { count: result && result.length });
                return;
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'notification_bad_request');
            return;
        } catch (err) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    };
}

export default NotificationController;
