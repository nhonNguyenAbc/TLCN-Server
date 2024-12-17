import { HttpStatusCode } from "axios";
import uploadFiles from "../middlewares/upload.middleware.js";
import { ReviewService } from "../services/review.service.js";
import { Response } from "../dto/response/response.js";



const createReviewController = async (req, res) => {
  try {

    await uploadFiles(req, res, async () => {
      const image = req.file
        ? {
            url: req.file.path,
            id: req.file.filename,
          }
        : null;

      const { restaurant_id, content, parent_id } = req.body;

      const reviewData = {
        restaurant_id,
        user_id: req.user.id, // Lấy ID người dùng từ token
        content,
        parent_id: parent_id || null, // Gán parent_id nếu có
      };

      // Thêm image nếu có
      if (image) {
        reviewData.image = image;
      }
      // Nếu parent_id có giá trị, kiểm tra bình luận cha
      if (parent_id) {
        const parentReview = await ReviewService.getReviewById(parent_id);

        if (!parentReview) {
          next(new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).resposeHandler(res))
        }
      }

      const result = await ReviewService.createReview(reviewData);
      return new Response(HttpStatusCode.Ok, 'Đăng nhập thành công', result).resposeHandler(res)
     
    });
  } catch (error) {
       next(new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).resposeHandler(res))
   }
};


const deleteReviewController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ReviewService.deleteReview(id);

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
    next(new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).resposeHandler(res))
  }
};

const updateReviewController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ReviewService.updateReview(id, {
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
    next(new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).resposeHandler(res))
  }
};

const getAllReviewsController = async (req, res) => {
  try {
    const { restaurant_id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const result = await ReviewService.getReviewsWithReplies(restaurant_id, page, limit);
    return new Response(HttpStatusCode.Ok, 'Đăng nhập thành công', result.comments, result.pagination).resposeHandler(res)

  } catch (error) {
    next(new Response(error.statusCode || HttpStatusCode.InternalServerError, error.message, null).resposeHandler(res))
  }
};

export const ReviewController = {
    createReviewController,
    updateReviewController,
    deleteReviewController,
    getAllReviewsController
}