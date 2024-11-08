import express from 'express';
import { VideoController } from '../controllers/video.controller.js';
const VideoRouter = express.Router();

// Route thêm video mới
VideoRouter.post('/', VideoController.addVideo);

// Route lấy tất cả video
VideoRouter.get('/', VideoController.getVideos);

// Route cập nhật lượt xem video
VideoRouter.put('/:videoId/view', VideoController.incrementViewCount);

export default VideoRouter