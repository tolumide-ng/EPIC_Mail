import Joi from 'joi';


export default {
    validateBody: (schema) => {
        const result = Joi.validate(req.body, schema);
        if (result.error) {
            return res.status(400).json({ error: result.error });
        }
    }
}