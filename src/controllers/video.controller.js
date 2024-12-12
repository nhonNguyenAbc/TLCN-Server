// controllers/video.controller.js
import {
  addVideoService,
  getVideosService,
  incrementViewCountService,
  getVideosByUserIdService,
  deleteVideoService,
  updateVideoService, // Import service mới
} from '../services/video.service.js';

const addVideo = async (req, res) => {
  // Kiểm tra nếu không có file được tải lên
  if (!req.file) {
    return res.status(400).json({ message: 'Vui lòng tải lên một video.' });
  }

  const { title, description, restaurant } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Tất cả các trường là bắt buộc.' });
  }

  try {
    // Lấy URL video từ Cloudinary (req.file.path được Multer cung cấp)
    const videoUrl = req.file.path;

    const newVideo = await addVideoService({
      videoUrl,
      title,
      description,
      restaurant
    });

    res.status(201).json({ message: 'Video đã được thêm thành công', video: newVideo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Đã có lỗi xảy ra, vui lòng thử lại sau.' });
  }
};


const getVideos = async (req, res) => {
  try {
    const {restaurantName} = req.query
    const videos = await getVideosService(restaurantName);
    res.status(200).json(videos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Không thể lấy video, vui lòng thử lại.' });
  }
};

const incrementViewCount = async (req, res) => {
  const { videoId } = req.params;

  try {
    const updatedVideo = await incrementViewCountService(videoId);
    res.status(200).json({ message: 'Lượt xem đã được cập nhật.', video: updatedVideo });
  } catch (error) {
    console.error(error);

    if (error.message === 'Video not found') {
      return res.status(404).json({ message: 'Video không tồn tại.' });
    }

    res.status(500).json({ message: 'Không thể cập nhật lượt xem, vui lòng thử lại.' });
  }
};


const getVideosByUserId = async (req, res) => {
  const { userId } = req.user;
  const { page = 1, limit = 10 } = req.query;

  try {
    const { videos, totalPages, currentPage } = await getVideosByUserIdService(userId, page, limit);

    res.status(200).json({ videos, totalPages, currentPage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Không thể lấy video, vui lòng thử lại.' });
  }
};




// Delete a video
const deleteVideo = async (req, res) => {
  const { videoId } = req.params;

  try {
    const deletedVideo = await deleteVideoService(videoId);
    res.status(200).json({ message: 'Video đã được xóa thành công.', video: deletedVideo });
  } catch (error) {
    console.error(error);

    if (error.message === 'Video not found') {
      return res.status(404).json({ message: 'Video không tồn tại.' });
    }

    res.status(500).json({ message: 'Không thể xóa video, vui lòng thử lại.' });
  }
};

// Update a video
const updateVideo = async (req, res) => {
  const { videoId } = req.params;
  const { title, description, videoUrl } = req.body;
  console.log('data', req.body)

  try {
    const updatedVideo = await updateVideoService(videoId, { title, description, videoUrl });
    res.status(200).json({ message: 'Video đã được cập nhật thành công.', video: updatedVideo });
  } catch (error) {
    console.error(error);

    if (error.message === 'Video not found') {
      return res.status(404).json({ message: 'Video không tồn tại.' });
    }

    res.status(500).json({ message: 'Không thể cập nhật video, vui lòng thử lại.' });
  }
};

export const VideoController = {
  addVideo,
  getVideos,
  incrementViewCount,
  getVideosByUserId,
  deleteVideo, // Xuất hàm mới
  updateVideo, // Xuất hàm mới
};

