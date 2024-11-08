import PromotionModel from "../models/promotions.models.js"
import { ConflictError } from "../errors/conflict.error.js"
import { NotFoundError } from "../errors/notFound.error.js"
import { BadRequestError } from "../errors/badRequest.error.js"
const createPromotion = async (user_id, data) => {
    const newPromotion = new PromotionModel({ ...data,user_id })
    return await newPromotion.save()
}

const updatePromotion = async (id, data) => {
    await PromotionModel.findOne({_id: id, deleted_at: null}).orFail(new NotFoundError('Không tìm thấy khuyến mãi'))
    return await PromotionModel.findByIdAndUpdate(id,{...data}, {new: true}).orFail(new BadRequestError('Không thể cập nhật'))
}

const deletePromotion = async (id) => {
  const promotion = await PromotionModel.findById(id).orFail(new NotFoundError('Không tìm thấy khuyến mãi'));
  await promotion.deleteOne(); // Permanently deletes the document from the database
  return { message: 'Khuyến mãi đã được xóa thành công' };
}

const getAllPromotion = async (user_id, size = 5, page = 1) => {
    try {
      // Tính toán giá trị skip cho phân trang
      const skip = (page - 1) * size;
  
      // Truy vấn khuyến mãi với điều kiện user_id và chưa bị xóa
      const promotions = await PromotionModel.find({ user_id, deleted_at: null })
        .skip(skip) // Bỏ qua các mục trước đó
        .limit(size) // Giới hạn số mục trả về
        .orFail(new NotFoundError('Không tìm thấy khuyến mãi'));
  
      // Tính tổng số khuyến mãi cho phân trang
      const totalCount = await PromotionModel.countDocuments({ user_id, deleted_at: null });
  
      return {
        data: promotions,
        info: {
          total: totalCount,
          page,
          size,
          number_of_pages: Math.ceil(totalCount / size),
        },
      };
    } catch (error) {
      // Xử lý lỗi tùy ý
      throw new Error(`Lỗi khi lấy danh sách khuyến mãi: ${error.message}`);
    }
  };
  

const getPromotionById = async(id) => {
    return await PromotionModel.findOne({_id:id, deleted_at:null}).orFail(new NotFoundError('Không tìm tháy khuyến mãi'))
}
export const PromotionService = {
    createPromotion,
    updatePromotion,
    deletePromotion,
    getAllPromotion,
    getPromotionById
}