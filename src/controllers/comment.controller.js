import CommentModel from '../models/comment.model.js';
import VideoModel from '../models/videos.model.js';

// Tạo bình luận mới cho video
const createComment = async (req, res) => {
  const { videoId } = req.params; // Lấy videoId từ params
  const { content } = req.body;  // Chỉ cần nội dung comment
  console.log('data', req.params)
  try {
    // Xác minh video tồn tại
    const video = await VideoModel.findById(videoId);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    // Tạo comment với userId từ req.user
    const newComment = new CommentModel({
      video: videoId,
      user: req.user.id,
      content,
    });

    await newComment.save();

    // Cập nhật danh sách comment của video
    await VideoModel.findByIdAndUpdate(videoId, {
      $push: { comments: newComment._id },
    });

    return res.status(201).json({ success: true, comment: newComment });
  } catch (error) {
    console.error('Error creating comment:', error);
    return res.status(500).json({ success: false, message: 'Failed to create comment' });
  }
};

const getCommentsForVideo = async (req, res) => {
  const { videoId } = req.params; // ID của video

  try {
    const comments = await CommentModel.find({ video: videoId })
      .populate('user', 'name')
      .sort({ createdAt: -1 }); 

    return res.status(200).json({ success: true, comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch comments' });
  }
};

export const CommentController = {
    createComment,
    getCommentsForVideo
}