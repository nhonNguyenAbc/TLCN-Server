import VideoModel from '../models/videos.model.js';
import CommentModel from '../models/comment.model.js';
import { RestaurantModel } from '../models/restaurants.model.js';

export const addVideoService = async (videoData) => {
  const newVideo = new VideoModel(videoData);
  return await newVideo.save();
};

export const getVideosService = async (restaurantName = "") => {
  // Nếu không có tên nhà hàng, trả toàn bộ video
  let restaurants = [];
  if (restaurantName) {
    // Tìm nhà hàng theo tên
    restaurants = await RestaurantModel.find({
      name: { $regex: restaurantName, $options: "i" }, // Tìm kiếm không phân biệt hoa thường
    });
  }

  // Lấy danh sách các video
  const videos = await VideoModel.find(
    restaurantName && restaurants.length > 0
      ? { restaurant: { $in: restaurants.map((r) => r._id) } } // Lọc theo nhà hàng
      : {} // Không có điều kiện nếu không tìm theo tên
  ).sort({ createdAt: -1 });

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
