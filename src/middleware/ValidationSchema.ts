import Joi, { ObjectSchema } from 'joi';
import { NextFunction, Response, Request } from 'express';
import Logging from '../library/Logging';
import { IAuthor } from '../models/Author';

export const ValidateSchema = (schema: ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validateAsync(req.body);
            next();
        } catch (e) {
            Logging.error(e);
            return res.status(422).json({ e });
        }
    };
};
export const Schemas = {
    author: {
        create: Joi.object<IAuthor>({
            name: Joi.string().required()
        })
    }
};
