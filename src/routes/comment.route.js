import express from 'express';
import { CommentController } from '../controllers/comment.controller.js';

const CommentRouter = express.Router();

// Route để tạo bình luận mới cho video
CommentRouter.post('/:videoId', CommentController.createComment);

// Route để lấy tất cả bình luận của video
CommentRouter.get('/:videoId', CommentController.getCommentsForVideo);

export default CommentRouter;
