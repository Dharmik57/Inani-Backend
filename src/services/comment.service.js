import CommentModel from '../models/comment';

class CommentService {
    add = (data) => {
        return CommentModel.create(data);
    };

    update = (id, data) => {
        return CommentModel.findByIdAndUpdate(id, data, { new: true })
    };
}

export default CommentService;
