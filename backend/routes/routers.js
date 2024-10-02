import express from 'express';
import * as db from '../db/db_queries.js';

const router = express.Router();

router.get(['/', '/index', '/homepage'], async (request, response) => {
  try {
    const images = {};
    const restaurants = await db.getRestaurants();
    const allImages = await db.getAllImages();
    allImages.forEach((image) => {
      images[image.restaurantID] = image.path;
    });
    response.status(200).json({
      restaurants, images, message: '', error: null,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      restaurants: [], images: [], message: null, error: `Error: Unable to load data: ${error.message}`,
    });
  }
});

router.get('/restaurant_details/:id', async (request, response) => {
  try {
    const ID = request.params.id;
    if (await db.getRestaurantById(ID) !== null) {
      const [restaurant, images, reservations, tables] = await Promise.all(
        [db.getRestaurantById(ID),
          db.getImages(ID),
          db.getReservations(ID),
          db.getTablesByRestaurant(ID),
        ],
      );

      response.status(200).json({
        restaurant, images, reservations, tables, error: null,
      });
    } else {
      response.status(500).json({
        restaurant: null, images: [], reervations: [], tables: [], error: 'Unable to load data',
      });
    }
  } catch (error) {
    console.log(error);
    response.status(500).json({
      restaurant: null, images: [], reservations: [], tables: [], error: `Unable to load data: ${error.message}`,
    });
  }
});

router.get('/all-reservations', async (request, response) => {
  try {
    const reservations = await db.getAllReservations();
    response.status(200).json({ reservations });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      reservations: [], error: `Error: Unable to load data: ${error.message}`,
    });
  }
});

router.get('/all-restaurants', async (request, response) => {
  try {
    const restaurants = await db.getRestaurants();
    response.status(200).json({ restaurants });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      reservations: [], error: `Error: Unable to load data: ${error.message}`,
    });
  }
});

export default router;
