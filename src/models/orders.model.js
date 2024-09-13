import mongoose, { Schema } from 'mongoose'
import { PAYMENT_STATUS } from '../constants/payment_status.constant.js'
import { PAYMENT_METHOD } from '../constants/payment_method.constant.js'
const ObjectId = Schema.ObjectId
const Order = new Schema(
  {
    user_id: { type: ObjectId, ref: 'Users', required: true },
    restaurant_id: { type: ObjectId, ref: 'Restaurants', required: true },
    name: { type: String, required: true },
    phone_number: { type: String, required: true },
    email: { type: String, required: true },
    payment: { type: String, require: true, enum: PAYMENT_METHOD },
    status: { type: String, required: true, enum: PAYMENT_STATUS },
    checkin: { type: Date, required: true },
    checkout: { type: Date, default: null },
    orderCode: { type: Number, default: Number(String(new Date().getTime()).slice(-6)) },
    total_people: { type: Number, required: true },
    list_menu: { type: [Object], required: true },
    total: { type: Number, default: 0 },
    created_at: { type: Date, required: true, default: Date.now },
    updated_at: { type: Date, required: true, default: Date.now },
    deleted_at: { type: Date, default: null }
  },
  { timestamps: true }
)
const OrderModel = mongoose.model('Orders', Order)

export { OrderModel }
