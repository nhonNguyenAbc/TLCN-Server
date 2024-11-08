import CommentModel from "../models/comment.model.js";
import VideoModel from "../models/videos.model.js"
const addVideo = async (req, res) => {
  const { videoUrl, title, description } = req.body;

  if (!videoUrl || !title || !description) {
    return res.status(400).json({ message: 'Tất cả các trường là bắt buộc.' });
  }

  try {
    const newVideo = new VideoModel({
      videoUrl,
      title,
      description,
    });

    await newVideo.save();

    res.status(201).json({ message: 'Video đã được thêm thành công', video: newVideo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Đã có lỗi xảy ra, vui lòng thử lại sau.' });
  }
};

const getVideos = async (req, res) => {
    try {
      const videos = await VideoModel.find().sort({ createdAt: -1 });
  
      const videoWithComments = await Promise.all(
        videos.map(async (video) => {
          const comments = await CommentModel.find({ video: video._id });
          return { ...video.toObject(), comments }; 
        })
      );
  
      res.status(200).json(videoWithComments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Không thể lấy video, vui lòng thử lại.' });
    }
  };
  
  
  const incrementViewCount = async (req, res) => {
    const { videoId } = req.params;
  
    try {
      const video = await VideoModel.findById(videoId);
  
      if (!video) {
        return res.status(404).json({ message: 'Video không tồn tại.' });
      }
  
      video.views += 1;
  
      await video.save();
  
      res.status(200).json({ message: 'Lượt xem đã được cập nhật.', video });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Không thể cập nhật lượt xem, vui lòng thử lại.' });
    }
  };
  
export const VideoController={
    addVideo,
    getVideos,
    incrementViewCount,
}  