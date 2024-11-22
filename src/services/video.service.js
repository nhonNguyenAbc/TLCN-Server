import VideoModel from '../models/videos.model.js';
import CommentModel from '../models/comment.model.js';
import { RestaurantModel } from '../models/restaurants.model.js';

// Add a new video
export const addVideoService = async (videoData) => {
  const newVideo = new VideoModel(videoData);
  return await newVideo.save();
};

// Get all videos with comments
export const getVideosService = async () => {
  const videos = await VideoModel.find().sort({ createdAt: -1 });

  // Nếu không có video nào, trả về mảng rỗng
  if (videos.length === 0) {
    return [];
  }

  const videoWithComments = await Promise.all(
    videos.map(async (video) => {
      const comments = await CommentModel.find({ video: video._id });
      const restaurant = await RestaurantModel.findById(video.restaurant);
      return { ...video.toObject(), comments, restaurantName: restaurant.name };
    })
  );

  return videoWithComments;
};


// Increment view count
export const incrementViewCountService = async (videoId) => {
  const video = await VideoModel.findById(videoId);

  if (!video) {
    throw new Error('Video not found');
  }

  video.views += 1;
  return await video.save();
};


// Lấy video theo userId mà không cần comment
export const getVideosByUserIdService = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const videos = await VideoModel.find({ user: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // Nếu không có video nào, trả về đối tượng với mảng videos rỗng và các trang phân trang
  const totalVideos = await VideoModel.countDocuments({ user: userId });
  
  return {
    videos: videos || [],
    totalPages: Math.ceil(totalVideos / limit),
    currentPage: page,
  };
};


// Delete a video by ID
export const deleteVideoService = async (videoId) => {
  const video = await VideoModel.findByIdAndDelete(videoId);

  if (!video) {
    throw new Error('Video not found');
  }

  // Xóa các bình luận liên quan đến video
  await CommentModel.deleteMany({ video: videoId });

  return video;
};

// Update a video by ID
export const updateVideoService = async (videoId, updateData) => {
  // console.log('data', updateData)
  const video = await VideoModel.findByIdAndUpdate(
    videoId,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!video) {
    throw new Error('Video not found');
  }

  return video;
};
