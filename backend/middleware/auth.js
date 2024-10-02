import jwt from 'jsonwebtoken';
import privateKey from '../utils/key.js';

export function verifyJWTToken(request, response, next) {
  response.locals.payload = {};
  if (request.cookies.token) {
    try {
      response.locals.payload = jwt.verify(request.cookies.token, privateKey);
    } catch (error) {
      console.log(error);
      response.clearCookie('token');
      return response.status(500).json({ error: error.toString() });
    }
  }
  return next();
}

export function checkJWTToken(request, response, next) {
  if (Object.keys(response.locals.payload).length === 0) {
    return response.status(401).json({ error: 'Sign in to continue' });
  }
  return next();
}

export function checkPermission(request, response, next) {
  if (response.locals.payload.admin !== true) {
    return response.status(403).json({ error: 'Permission denied' });
  }
  return next();
}
