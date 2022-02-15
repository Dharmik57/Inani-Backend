import { HTTP_STATUS } from '../common/constant';
import CommentService from '../services/comment.service';
import { response } from '../utility/helpers';
import tokenInfo from '../utility/jwt/tokenInfo';

class CommentController {
    constructor() {
        this.commentService = new CommentService();
    }

    add = async (req, res) => {
        try {
            const user = tokenInfo(req, res);
            const request = req.body;
            request.user_id = user.id;

            const result = await this.commentService.add(request);
            if (result) {
                response(res, HTTP_STATUS.SUCCESS, 'comment_add', result);
                return;
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'comment_bad_request');
            return;
        } catch (err) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    };

    update = async (req, res) => {
        try {
            const id = req.params.product_id
            const request = req.body;
            const result = await this.commentService.update(id, request);
            if (result) {
                response(res, HTTP_STATUS.SUCCESS, 'comment_update', result);
                return;
            }
            response(res, HTTP_STATUS.BAD_REQUEST, 'comment_bad_request');
            return;
        } catch (err) {
            response(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'internal_server_error');
            return;
        }
    };

}

export default CommentController;
