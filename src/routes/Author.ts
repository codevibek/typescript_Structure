import express from 'express';
import createAuthor from '../controllers/Author';
import { Schemas, ValidateSchema } from '../middleware/ValidationSchema';

const router = express.Router();

router.post('/create', ValidateSchema(Schemas.author.create), createAuthor);

export default router;
