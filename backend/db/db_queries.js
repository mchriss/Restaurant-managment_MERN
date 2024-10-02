import bcrypt from 'bcrypt';
import path from 'path';
import * as models from './db_schemas.js';
import connect from './db_connection.js';

connect();

export function getRestaurantById(id) {
  return models.RestaurantModel.findById(id).exec();
}

export async function getRestaurantByName(name) {
  const restaurants = await models.RestaurantModel.find({ name });
  return restaurants[0];
}

export function getRestaurants() {
  return models.RestaurantModel.find().exec();
}

export function getUserById(id) {
  return models.UserModel.findById(id).exec();
}

export async function getUserByUsername(username) {
  const users = await models.UserModel.find({ username }).exec();
  return users[0];
}

export async function getPassword(username) {
  const user = await getUserByUsername(username);
  return user.password;
}

export async function getRole(username) {
  const user = await getUserByUsername(username);
  return user.admin;
}

export function getUsers() {
  return models.UserModel.find().exec();
}

export function getImages(id) {
  return models.ImageModel.find({ restaurantID: id }).exec();
}

export function getAllImages() {
  return models.ImageModel.find().exec();
}

export function getAllReservations() {
  return models.ReservationModel.find().exec();
}

export function getReservations(id) {
  return models.ReservationModel.find({ restaurantID: id }).exec();
}

export function getTablesByRestaurant(id) {
  return models.TableModel.find({ restaurantID: id }).exec();
}

export async function getTableByNumber(restaurantID, number) {
  const tables = await models.TableModel.find({ restaurantID, number }).exec();
  return tables[0];
}

async function addTable(restaurantID, number, x, y) {
  const table = new models.TableModel({
    restaurantID,
    number,
    x,
    y,
  });
  await table.save();
}

export async function addDefaultTables(restaurantID) {
  await models.TableModel.deleteMany({ restaurantID });

  await addTable(restaurantID, 1, 58, 112);
  await addTable(restaurantID, 2, 58, 280);
  await addTable(restaurantID, 3, 227, 162);
  await addTable(restaurantID, 4, 415, 162);
  await addTable(restaurantID, 5, 602, 162);
  await addTable(restaurantID, 6, 790, 162);
  await addTable(restaurantID, 7, 321, 245);
  await addTable(restaurantID, 8, 508, 245);
  await addTable(restaurantID, 9, 696, 245);
  await addTable(restaurantID, 10, 522, 40);
  await addTable(restaurantID, 11, 645, 40);
  await addTable(restaurantID, 12, 768, 40);
}

export async function addRestaurant(request) {
  const restaurant = new models.RestaurantModel({
    name: request.restName,
    city: request.city,
    street: request.street,
    buildingNr: parseInt(request.buildingNr, 10),
    phoneNr: request.phoneNr,
    openHr: request.openHr,
    closeHr: request.closeHr,
    categories: request.categories.toLowerCase(),
  });
  await restaurant.save();
  const newRest = await getRestaurantByName(request.restName);
  await addDefaultTables(newRest._id.toString());
}

export async function addReservation(request, payload) {
  const reservation = new models.ReservationModel({
    restaurantID: request.restId,
    userID: payload.userID,
    username: payload.personName,
    date: Date.parse(request.resrvDate),
    tableNr: request.tableNr,
    status: 'PENDING',
  });
  await reservation.save();
}

export async function addImage(request) {
  const ID = request.params.id;
  const fileHandler = request.files.images;
  if (fileHandler.constructor === Array) {
    fileHandler.forEach(async (file) => {
      const image = new models.ImageModel({
        restaurantID: ID,
        path: file.path.split(path.sep).splice(-1)[0],
      });
      await image.save();
    });
  } else {
    const image = new models.ImageModel({
      restaurantID: ID,
      path: fileHandler.path.split(path.sep).splice(-1)[0],
    });
    await image.save();
  }
}

export async function addUser(request) {
  const { username, personName, password } = request.fields;
  const user = new models.UserModel({
    username,
    personName,
    admin: false,
    password,
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
}

export async function deleteRestaurant(id) {
  await models.ImageModel.deleteMany({ restaurantID: id });
  await models.TableModel.deleteMany({ restaurantID: id });
  await models.ReservationModel.deleteMany({ restaurantID: id });
  return models.RestaurantModel.deleteOne({ _id: id });
}

export async function deleteReservation(id) {
  return models.ReservationModel.deleteOne({ _id: id });
}

export async function deleteImage(id) {
  return models.ImageModel.deleteOne({ _id: id });
}

export async function filterRestaurants(request) {
  const { name, categories } = request.fields;
  const checks = categories.split(' ');
  const allRes = await getRestaurants();
  let filtered = allRes.filter((rest) => rest.name.toLowerCase().includes(name.toLowerCase()));
  checks.forEach((check) => {
    filtered = filtered.filter((rest) => rest.categories.includes(check));
  });
  return filtered;
}

export async function filterReservations(status) {
  const allReservations = await getAllReservations();
  const filtered = allReservations.filter((reservation) => reservation.status === status);
  console.log(status);
  console.log(filtered);
  return filtered;
}

export async function approveReservation(id, approved) {
  return models.ReservationModel.findByIdAndUpdate(id, {
    status: approved ? 'APPROVED' : 'DECLINED',
  });
}
