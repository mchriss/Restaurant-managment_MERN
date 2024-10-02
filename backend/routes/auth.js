import cookieParser from 'cookie-parser';
import express from 'express';
import jwt from 'jsonwebtoken';
import * as db from '../db/db_queries.js';
import * as validate from '../middleware/validations.js';
// import * as handler from '../middleware/handlers.js';
import privateKey from '../utils/key.js';

const router = express.Router();
router.use(cookieParser());

router.post('/register', validate.validateRegistration, async (request, response) => {
  try {
    const { username, personName } = request.fields;
    const admin = false;
    await db.addUser(request);
    const user = await db.getUserByUsername(username);
    const userID = user._id;
    const token = jwt.sign({
      userID, username, personName, admin,
    }, privateKey);
    response.clearCookie('token');
    response.cookie('token', token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });
    response.status(200).json({ token, error: null });
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: error.message });
  }
});

router.post('/login', validate.validateLogin, async (request, response) => {
  try {
    const { username } = request.fields;
    const user = await db.getUserByUsername(username);
    const userID = user._id;
    const { admin, personName } = user;
    const token = jwt.sign({
      userID, username, personName, admin,
    }, privateKey);
    response.clearCookie('token');
    response.cookie('token', token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });
    response.status(200).json({ token, error: null });
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: error.message });
  }
});

router.delete('/logout', (request, response) => {
  response.clearCookie('token');
  response.status(204).json({ error: null });
});

export default router;
