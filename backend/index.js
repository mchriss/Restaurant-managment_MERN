import {
  existsSync, mkdirSync,
} from 'fs';
import cookieParser from 'cookie-parser';
import express from 'express';
import morgan from 'morgan';
import eformidable from 'express-formidable';
import { join } from 'path';
import cors from 'cors';
import router from './routes/routers.js';
import api from './routes/api.js';
import auth from './routes/auth.js';
import { verifyJWTToken } from './middleware/auth.js';

const uploadDir = join(process.cwd(), 'static/uploadDir');
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir);
}

const app = express();
app.use(morgan('tiny'));
app.use(cookieParser());
app.use(express.static(join(process.cwd(), 'static')));
app.use(eformidable({ uploadDir, multiples: true }));
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(verifyJWTToken);
app.use('/', router);
app.use('/', api);
app.use('/', auth);
app.listen(8080, () => { console.log('Server is listening on http://localhost:8080/...'); });
