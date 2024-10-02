import express from 'express';
import * as db from '../db/db_queries.js';
import * as validate from '../middleware/validations.js';
import * as handler from '../middleware/handlers.js';
import { checkJWTToken, checkPermission } from '../middleware/auth.js';

const router = express.Router();

router.delete('/delete-reservation/:id', async (request, response) => {
  try {
    await db.deleteReservation(request.params.id);
    response.status(200).json({ error: null });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error });
  }
});

router.delete('/delete-restaurant/:id', async (request, response) => {
  try {
    await db.deleteRestaurant(request.params.id);
    response.status(200).json({ error: null });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error });
  }
});

router.delete('/delete-image/:id', async (request, response) => {
  try {
    await db.deleteImage(request.params.id);
    response.status(200).json({ error: null });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error });
  }
});

router.post('/filter-restaurants', async (request, response) => {
  try {
    const restaurants = await db.filterRestaurants(request);
    response.status(200).json({ restaurants, error: null });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error });
  }
});

router.post('/filter-reservations', async (request, response) => {
  try {
    const restaurants = await db.filterReservations(request.fields.status);
    response.status(200).json({ restaurants, error: null });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error });
  }
});

router.post('/approve-reservation/:id/:approved', async (request, response) => {
  try {
    const { id, approved } = request.params;
    if (approved === 'approve') {
      await db.approveReservation(id, true);
      response.status(200).json({ error: null });
    } else {
      await db.approveReservation(id, false);
      response.status(200).json({ error: null });
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ error });
  }
});

router.post('/add-restaurant', checkJWTToken, checkPermission, validate.validateNewRestaurant, handler.handleNewRestaurant);
router.post('/add-reservation', checkJWTToken, validate.validateNewReservation, handler.handleNewReservation);
router.post('/add-images/:id', checkJWTToken, checkPermission, validate.validateNewImage, handler.handleNewImage);

export default router;
