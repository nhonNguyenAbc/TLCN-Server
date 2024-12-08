import mongoose, { Schema } from 'mongoose'
const ObjectId = Schema.ObjectId

const Restaurant = new Schema(
  {
    name: { type: String, required: true, unique: true },
    // latitude: { type: String, required: true },
    // longitude: { type: String, required: true },
    address: { type: String, required: true, unique: true },
    openTime: { type: String, required: true },
    closeTime: { type: String, required: true },
    description: { type: String, required: true },
    image_url: { type: String, required: true },
    slider1: { type: String, required: true },
    slider2: { type: String, required: true },
    slider3: { type: String, required: true },
    slider4: { type: String, required: true },
    public_id_avatar: { type: String, required: true },
    public_id_slider1: { type: String, required: true },
    public_id_slider2: { type: String, required: true },
    public_id_slider3: { type: String, required: true },
    public_id_slider4: { type: String, required: true },
    price_per_table: { type: Number, required: true },
    orderAvailable: {type: Number, default: 0},
    peopleAvailable: {type: Number, default: 0},
    limitTime: {type: Number, default: 1},
    promotions: { type: String },
    createdAt: { type: Date, required: true, default: Date.now },
    updated_at: { type: Date, required: true, default: Date.now },
    deleted_at: { type: Date, default: null },
    user_id: { type: ObjectId, refs: 'Users', required: true }
  },
)
const RestaurantModel = mongoose.model('Restaurants', Restaurant)

export { RestaurantModel }
