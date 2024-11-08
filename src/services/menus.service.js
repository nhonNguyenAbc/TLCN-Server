import MenuItem from '../models/menus.model.js'
import mongoose, { Types } from 'mongoose'
import { RestaurantModel } from '../models/restaurants.model.js'
import { BadRequestError } from '../errors/badRequest.error.js'
import { NotFoundError } from '../errors/notFound.error.js'
const createMenuItem = async ({ code, name, category, description, unit, price, discount, restaurant_id }, image) => {
  const restaurant = await RestaurantModel.find({
    _id: restaurant_id,
    deleted_at: null
  }).orFail(new NotFoundError('Nhà hàng không tồn tại'))

  const check = await MenuItem.find({
    code,
    restaurant_id
  })
  if (check.length > 0) {
    throw new BadRequestError('Món ăn đã tồn tại trong nhà hàng này')
  }

  const newMenuItem = new MenuItem({
    _id: new mongoose.Types.ObjectId(),
    code,
    name,
    category,
    description,
    image,
    unit,
    price,
    discount,
    restaurant_id,
    created_at: new Date(),
    updated_at: new Date()
  })

  return await newMenuItem.save()
}

const getAllMenuItems = async (page = 1, size = 5) => {
  const items = await MenuItem.aggregate([
    {
      $match: {
        deleted_at: null
      }
    },
    {
      $lookup: {
        from: 'restaurants',
        localField: 'restaurant_id',
        foreignField: '_id',
        as: 'restaurant'
      }
    },
    {
      $unwind: '$restaurant'
    },
    {
      $skip: (Number(page) - 1) * Number(size)
    },
    {
      $limit: Number(size)
    },
    {
      $project: {
        _id: 1,
        code: 1,
        name: 1,
        category: 1,
        description: 1,
        unit: 1,
        price: 1,
        discount: 1,
        restaurant: {
          name: 1,
          _id: 1
        },
        image:1
      }
    }
  ])

  return {
    data: items,
    info: {
      total: await MenuItem.countDocuments({ deleted_at: null }),
      page,
      size,
      number_of_pages: Math.ceil((await MenuItem.countDocuments({ deleted_at: null })) / size)
    }
  }
}
const getAllMenuItemsByUserId = async (id, page = 1, size = 5) => {
  const items = await MenuItem.aggregate([
    {
      $match: {
        deleted_at: null
      }
    },
    {
      $lookup: {
        from: 'restaurants',
        localField: 'restaurant_id',
        foreignField: '_id',
        as: 'restaurant'
      }
    },
    {
      $unwind: '$restaurant'
    },
    {
      $match: {
        'restaurant.user_id': id,
        'restaurant.deleted_at': null
      }
    },
    {
      $skip: (Number(page) - 1) * Number(size)
    },
    {
      $limit: Number(size)
    },
    {
      $project: {
        _id: 1,
        code: 1,
        name: 1,
        category: 1,
        description: 1,
        unit: 1,
        price: 1,
        discount: 1,
        restaurant: {
          name: 1,
          _id: 1
        }
      }
    }
  ])
  const total = await MenuItem.countDocuments({
    deleted_at: null,
    restaurant_id: {
      $in: await RestaurantModel.find({ user_id: id, deleted_at: null }).distinct('_id')
    }
  })
  return {
    data: items,
    info: {
      total,
      page,
      size,
      number_of_pages: Math.ceil(total / size)
    }
  }
}
const getMenuItemById = async (id) => {
  const item = await MenuItem.aggregate([
    {
      $match: {
        _id: Types.ObjectId.createFromHexString(id),
        deleted_at: null
      }
    },
    {
      $lookup: {
        from: 'restaurants',
        localField: 'restaurant_id',
        foreignField: '_id',
        as: 'restaurant'
      }
    },
    {
      $unwind: '$restaurant'
    },
    {
      $project: {
        _id: 1,
        code: 1,
        name: 1,
        category: 1,
        description: 1,
        unit: 1,
        price: 1,
        discount: 1,
        restaurant: {
          name: 1,
          _id: 1
        }
      }
    }
  ])
  return item
}

const updateMenuItemById = async (id, { code, name, category, description, unit, price, discount, restaurant_id, image }) => {
  return await MenuItem.findByIdAndUpdate(
    Types.ObjectId.createFromHexString(id),
    {
      $set: {
        code,
        name,
        category,
        description,
        image,
        unit,
        price,
        discount,
        restaurant_id,
        updated_at: new Date()
      }
    },
    { new: true }
  )
}

const deleteMenuItemById = async (id) => {
  const item = await MenuItem.findByIdAndUpdate(Types.ObjectId.createFromHexString(id), { deleted_at: Date.now() })
  return item
}

const findMenuItemsByAnyField = async (searchTerm, page = 1, size = 5) => {
  const isObjectId = mongoose.Types.ObjectId.isValid(searchTerm)

  const query = {
    $or: [
      { _id: isObjectId ? Types.ObjectId.createFromHexString(searchTerm) : null },
      { code: { $regex: searchTerm, $options: 'i' } },
      { name: { $regex: searchTerm, $options: 'i' } },
      { category: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } },
      { unit: { $regex: searchTerm, $options: 'i' } },
      { price: isNaN(searchTerm) ? null : searchTerm },
      { discount: isNaN(searchTerm) ? null : searchTerm },
      { restaurant_id: isObjectId ? Types.ObjectId.createFromHexString(searchTerm) : null }
    ]
  }

  const menus = await MenuItem.find(query)
    .skip((page - 1) * size)
    .limit(size)
    .exec()
  const total = await MenuItem.countDocuments(query)
  return { data: menus, info: { total, number_of_pages: Math.ceil(total / size), page, size } }
}
const countMenu = async () => {
  return await MenuItem.countDocuments({ deleted_at: null })
}

export const MenuService = {
  createMenuItem,
  getAllMenuItems,
  getMenuItemById,
  updateMenuItemById,
  deleteMenuItemById,
  findMenuItemsByAnyField,
  countMenu,
  getAllMenuItemsByUserId
}
