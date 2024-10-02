import bcrypt from 'bcrypt';
import * as db from '../db/db_queries.js';

async function checkExistingRestaurantByName(name) {
  try {
    const restaurant = await db.getRestaurantByName(name);
    if (restaurant === null || restaurant === undefined || restaurant.length === 0) return false;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function checkRestaurantName(name) {
  const nameRegex = /^[A-Z][A-Za-z0-9 '-]+$/;
  const exists = await checkExistingRestaurantByName(name);
  return (!name || !nameRegex.test(name) || exists);
}

function checkAddress(request) {
  const cityRegex = /^[A-Z][A-Za-z ]+$/;
  const streetRegex = /^[A-Z][A-Z a-z0-9'-]+$/;
  return (!request.fields.city || !cityRegex.test(request.fields.city)
    || !request.fields.street || !streetRegex.test(request.fields.street)
    || !request.fields.buildingNr);
}

function checkPhoneNumber(phoneNumber) {
  const phoneRegex = /^\+?[0-9]+$/;
  return (!phoneNumber || !phoneRegex.test(phoneNumber));
}

export function checkFileType(files) {
  const fileTypes = ['.jpg', '.jpeg', '.png', '.svg', '.gif'];
  if (files.constructor === Array) {
    for (let i = 0; i < files.length; i += 1) {
      const index = files[i].name.lastIndexOf('.');
      const type = files[i].name.substr(index, files[i].name.length).toLowerCase();
      if (!(fileTypes.includes(type))) {
        return false;
      }
    }
    return true;
  }
  const index = files.name.lastIndexOf('.');
  const type = files.name.substr(index, files.name.length).toLowerCase();
  return (fileTypes.includes(type));
}

export async function validateNewRestaurant(request, response, next) {
  if (await checkRestaurantName(request.fields.restName)) {
    console.log('Invalid Restaurant name');
    return response.status(400).json({ error: 'Invalid Restaurant name' });
  }
  if (checkAddress(request)) {
    console.log('Invalid Restaurant Address');
    return response.status(400).json({ error: 'Invalid Restaurant Address' });
  }
  if (checkPhoneNumber(request.fields.phoneNr)) {
    console.log('Empty Restaurant Phone Number field');
    return response.status(400).json({ error: 'Empty Restaurant Phone number field' });
  }
  if (!request.fields.openHr) {
    console.log('Empty Restaurant Opening hour field');
    return response.status(400).json({ error: 'Empty Restaurant Opening hour field' });
  }
  if (!request.fields.closeHr) {
    console.log('Empty Restaurant Closing hour field');
    return response.status(400).json({ error: 'Empty Restaurant Closing hour field' });
  }
  return next();
}

async function checkExistingRestaurant(id) {
  try {
    const restaurant = await db.getRestaurantById(id);
    if (restaurant === null) return false;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function checkExistingUserByUsername(username) {
  try {
    const user = await db.getUserByUsername(username);
    if (user === undefined) {
      return false;
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function checkReservationTime(restID, resrvDate) {
  try {
    const restaurant = await db.getRestaurantById(restID);
    const resrv = resrvDate.slice(-5);
    const { openHr, closeHr } = restaurant;
    const [resrvHour, resrvMin] = resrv.split(':');
    const [openHour, openMin] = openHr.split(':');
    const [closeHour, closeMin] = closeHr.split(':');
    const totalResrvMins = resrvHour * 60 + parseInt(resrvMin, 10);
    const totalOpenMins = openHour * 60 + parseInt(openMin, 10);
    let totalCloseMins = closeHour * 60 + parseInt(closeMin, 10);
    if (closeHr < openHr) {
      totalCloseMins += 24 * 60;
    }

    if (totalResrvMins < totalOpenMins || totalResrvMins > totalCloseMins) {
      return false;
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function checkReservationTable(restID, request) {
  const { tableNr, date } = request;
  if (!tableNr || tableNr > 12) {
    return false;
  }
  let available = true;
  try {
    const reservations = await db.getReservations(restID);
    const newDate = new Date(date);
    reservations.forEach((reservation) => {
      const resTable = reservation.tableNr;
      if (resTable === tableNr) {
        const resDate = new Date(new Date(reservation.date).toLocaleTimeString());
        const minLimit = new Date(resDate.getTime() - 2 * 60 * 60 * 1000);
        const maxLimit = new Date(resDate.getTime() + 2 * 60 * 60 * 1000);
        if (newDate.getTime() > minLimit.getTime() && newDate.getTime() < maxLimit.getTime()) {
          available = false;
        }
      }
    });
    return available;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function validateNewReservation(request, response, next) {
  const restID = request.fields.restId;
  if (!restID || restID < 1 || !await checkExistingRestaurant(restID)) {
    console.log('Invalid Restaurant ID');
    return response.status(400).json({ error: 'Invalid Restaurant ID' });
  }
  if (!request.fields.resrvDate) {
    console.log('Invalid reservation time field');
    return response.status(400).json({ error: 'Invalid reservation time field' });
  }
  const timeCheck = await checkReservationTime(restID, request.fields.resrvDate);
  if (!timeCheck) {
    console.log('Invalid reservation time');
    return response.status(400).json({ error: 'Invalid reservation time' });
  }

  const tableCheck = await checkReservationTable(restID, request.fields);
  if (!tableCheck) {
    console.log('Invalid table number!');
    return response.status(400).json({ error: 'Invalid table number' });
  }
  return next();
}

export function validateNewImage(request, response, next) {
  const files = request.files.images;
  if (!files) {
    console.log('No files uploaded');
    return response.status(400).json({ error: 'No files uploaded' });
  }
  if (!checkFileType(files)) {
    console.log('Invalid file format');
    return response.status(400).json({ error: 'Invalid file format' });
  }
  return next();
}

function checkPersonName(personName) {
  const nameRegex = /^([A-Za-z]+[,.]?[ ]?|[A-Za-z]+['-]?)+/;
  return (!personName || !nameRegex.test(personName));
}

export async function validateRegistration(request, response, next) {
  if (!request.fields.username) {
    console.log('Invalid username field');
    return response.status(400).json({ error: 'Invalid username field' });
  }
  if (await checkExistingUserByUsername(request.fields.username)) {
    console.log('Username is already taken');
    return response.status(400).json({ error: 'Username is already taken' });
  }

  if (checkPersonName(request.fields.personName)) {
    console.log('Invalid full name field');
    return response.status(400).json({ error: 'Invalid full name field' });
  }

  if (!request.fields.password || !request.fields.passwordAgain) {
    console.log('Invalid password field');
    return response.status(400).json({ error: 'Invalid password field' });
  }

  if (request.fields.password !== request.fields.passwordAgain) {
    console.log('Passwords must match');
    return response.status(400).json({ error: 'Passwords must match' });
  }

  return next();
}

export async function validateLogin(request, response, next) {
  if (!request.fields.username) {
    console.log('Invalid username field');
    return response.status(400).json({ error: 'Invalid username field' });
  }
  if (!request.fields.password) {
    console.log('Invalid password field');
    return response.status(400).json({ error: 'Invalid password field' });
  }
  if (!await checkExistingUserByUsername(request.fields.username)) {
    console.log('User does not exist');
    return response.status(400).json({ error: 'User does not exist' });
  }

  try {
    const password = await db.getPassword(request.fields.username);
    if (!await bcrypt.compare(request.fields.password, password)) {
      console.log('Invalid username or password');
      return response.status(400).json({ error: 'Invalid username or password' });
    }
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error: error.message });
  }

  return next();
}
