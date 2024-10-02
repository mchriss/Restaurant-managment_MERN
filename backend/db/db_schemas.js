import { mongoose } from 'mongoose';

const RestaurantSchema = new mongoose.Schema({
  name: String,
  city: String,
  street: String,
  buildingNr: Number,
  phoneNr: String,
  openHr: String,
  closeHr: String,
  categories: String,
});

const TableSchema = new mongoose.Schema({
  restaurantID: Object,
  number: Number,
  x: Number,
  y: Number,
});

const ImageSchema = new mongoose.Schema({
  restaurantID: Object,
  path: String,
});

const ReservationSchema = new mongoose.Schema({
  restaurantID: Object,
  userID: Object,
  username: String,
  tableNr: Number,
  date: Date,
  status: String,
});

const UserSchema = new mongoose.Schema({
  username: String,
  personName: String,
  admin: Boolean,
  password: String,
});

export const RestaurantModel = mongoose.model('Restaurant', RestaurantSchema);
export const TableModel = mongoose.model('Table', TableSchema);
export const ImageModel = mongoose.model('Image', ImageSchema);
export const ReservationModel = mongoose.model('Reservation', ReservationSchema);
export const UserModel = mongoose.model('User', UserSchema);
