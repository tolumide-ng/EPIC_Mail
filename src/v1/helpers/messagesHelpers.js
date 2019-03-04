import Joi from 'joi';

export default {
    validateBody: (schema) => {
        return (req, res, next) => {
            const result = Joi.validate(req.body, schema);
            if (result.error) {
                return res.status(400).json({ status: 400, error: result.error })
            }
            // send req.value.body rather than req.body
            if (!req.value) { req.value = {}; }
            req.value['body'] = result.value;
            next();
        }
    },

    schemas: {
        authSchema: Joi.object.keys({
            subject: Joi.string(),
            message: Joi.string().required(),
            parentMessageId: Joi.string().required(),
            status: Joi.string().valid('draft', 'read', 'sent').insensitive().required()
        })
    }
}