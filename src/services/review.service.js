import ReviewModel from "../models/reviews.model.js";
import { UserModel } from "../models/users.model.js";

// Dịch vụ tạo bình luận
export const createReview = async (data) => {
  try {
    console.log(data)
    const review = new ReviewModel(data);
    return await review.save();
  } catch (error) {
    throw error;
  }
};

// Dịch vụ xóa bình luận
export const deleteReview = async (id) => {
  try {
    return await ReviewModel.findByIdAndUpdate(
      id,
      { deleted_at: new Date() },
      { new: true }
    );
  } catch (error) {
    throw error;
  }
};

// Dịch vụ cập nhật bình luận
export const updateReview = async (id, data) => {
  try {
    return await ReviewModel.findByIdAndUpdate(
      id,
      { ...data, updated_at: new Date() },
      { new: true }
    );
  } catch (error) {
    throw error;
  }
};

// Dịch vụ lấy danh sách bình luận theo restaurantId
export const getAllReviewsByRestaurant = async (restaurant_id, page = 1, limit = 3) => {
    try {
        // Tính toán skip dựa trên page và limit
        const skip = (page - 1) * limit;

        // Truy vấn tất cả bình luận theo restaurant_id với phân trang và sắp xếp
        const reviews = await ReviewModel.find({
            restaurant_id,
            deleted_at: null,
        })
            .sort({ created_at: -1 }) // Sắp xếp giảm dần theo created_at
            .skip(skip) // Bỏ qua số lượng bản ghi
            .limit(limit) // Giới hạn số lượng bản ghi
            .lean(); // Dùng lean để làm việc với dữ liệu thuần JavaScript

        // Lấy tất cả user_id từ các bình luận
        const userIds = reviews.map((review) => review.user_id);

        // Truy vấn tất cả thông tin user dựa vào mảng user_id
        const users = await UserModel.find({ _id: { $in: userIds } })
            .select("_id username") // Lấy thông tin cần thiết
            .lean();

        // Tạo một Map để tìm thông tin user nhanh chóng
        const userMap = new Map(users.map((user) => [user._id.toString(), user.username]));

        // Thêm username vào từng bình luận
        const reviewsWithUsernames = reviews.map((review) => ({
            ...review,
            username: userMap.get(review.user_id.toString()) || "Unknown", // Thêm username
        }));

        // Tính tổng số bình luận và số trang
        const total = await ReviewModel.countDocuments({ restaurant_id, deleted_at: null });
        const totalPages = Math.ceil(total / limit); // Tính tổng số trang

        // Trả về kết quả bao gồm phân trang
        return {
            data: reviewsWithUsernames,
            currentPage: page,
            total,
            totalPages,
        };
    } catch (error) {
        throw error;
    }
};
