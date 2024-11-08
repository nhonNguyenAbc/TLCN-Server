import  mongoose from "mongoose"

// Định nghĩa schema cho Video
const videoSchema = new mongoose.Schema(
  {
    videoUrl: {
      type: String, // URL của video (có thể là URL từ Cloudinary hoặc dịch vụ lưu trữ khác)
      required: true,
    },
    title: {
      type: String, // Tiêu đề video
      required: true,
      trim: true,
    },
    description: {
      type: String, // Mô tả ngắn gọn cho video
      required: true,
      trim: true,
    },
    likes: {
      type: Number, // Số lượt thích video
      default: 0,
    },
    views: {
      type: Number, // Số lượt xem video
      default: 0,
    },
    createdAt: {
      type: Date, // Thời gian tạo video
      default: Date.now,
    },
    comment: {type: String,required: true, unique: true}
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

// Tạo model từ schema
const VideoModel = mongoose.model('Video', videoSchema);

export default VideoModel