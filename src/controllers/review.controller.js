import * as reviewService from "../services/review.service.js";
import uploadFiles from "../middlewares/upload.middleware.js";

// Tạo Review
const createReviewController = async (req, res) => {
  try {
    console.log("data",req.body)
    await uploadFiles(req, res, async () => {
      const image = req.file
        ? {
            url: req.file.path,
            id: req.file.filename,
          }
        : null;

      const reviewData = {
        restaurant_id: req.body.restaurant_id,
        user_id: req.user.id,
        content: req.body.content,
      };

      if (image) {
        reviewData.image = image;
      }

      const result = await reviewService.createReview(reviewData);

      return res.status(201).json({
        success: true,
        data: result,
      });
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa Review
const deleteReviewController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await reviewService.deleteReview(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Review không tồn tại hoặc đã xóa.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review đã xóa thành công.",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật Review
const updateReviewController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await reviewService.updateReview(id, {
      content: req.body.content,
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Review không tồn tại.",
      });
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy danh sách Review theo restaurantId
const getAllReviewsController = async (req, res) => {
  try {
    const { restaurant_id } = req.params;
    const {page, limit} = req.query
    const reviews = await reviewService.getAllReviewsByRestaurant(restaurant_id, page, limit);

    return res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const ReviewController = {
    createReviewController,
    updateReviewController,
    deleteReviewController,
    getAllReviewsController
}