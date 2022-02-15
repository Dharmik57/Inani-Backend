import responseMessage from '../../common/responseMessage.json';
import { HTTP_STATUS } from '../../common/constant';
import { response } from '../helpers';

const validateRequest = (req, res, next, schema) => {
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true, // remove unknown props
    };
    const { error, value } = schema.validate(req.body, options);
    if (error) {
        return response(
            res,
            HTTP_STATUS.BAD_REQUEST,
            responseMessage.validation_error,
            null,
            error.details.map((x) => x.message).join(', ')
        );
    }
    req.body = value;
    next();
};

export default validateRequest;
