import * as db from '../db/db_queries.js';

export async function handleNewRestaurant(request, response) {
  try {
    await db.addRestaurant(request.fields);
    response.status(200).json({ error: null });
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: `Error: Unable to insert data: ${error.message}` });
  }
}

export async function handleNewReservation(request, response) {
  try {
    await db.addReservation(request.fields, response.locals.payload);
    response.status(200).json({ error: null });
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: `Error: Unable to insert data: ${error.message}` });
  }
}

export async function handleNewImage(request, response) {
  try {
    await db.addImage(request);
    response.status(200).json({ error: null });
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: `Error: Unable to insert data: ${error.message}` });
  }
}
