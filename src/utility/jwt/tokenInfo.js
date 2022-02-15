import jwt from 'jsonwebtoken';
import tokenSecret from '../../config/jwt.config';
import { HTTP_STATUS } from '../../common/constant';
import responseMessage from '../../common/responseMessage.json';
import { response } from '../helpers';

const tokenInfo = (req, res) => {
    const token = req.headers.authorization;

    if (token == null) return response(res, HTTP_STATUS.NOT_AUTHORISED, responseMessage.not_authorised);

    return jwt.verify(token, tokenSecret);
};

export default tokenInfo;
