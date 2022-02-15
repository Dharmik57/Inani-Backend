import NotificationModel from '../models/notification';
import { NOTIFICATION_TYPE } from '../common/constant';

export const sendNotification = (data) => {
    data.type = NOTIFICATION_TYPE?.TEXT
    return NotificationModel.create(data);

}