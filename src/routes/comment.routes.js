import express from 'express';
import CommentController from '../controllers/comment.controller';

const commentRouter = express.Router();
const commentController = new CommentController();

// Create a new comment
commentRouter.post('/', commentController.add);

// Update a particular comment
commentRouter.put("/:product_id", commentController.update);

export default commentRouter;
