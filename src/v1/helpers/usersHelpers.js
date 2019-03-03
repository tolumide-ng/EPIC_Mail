import Joi from 'joi';


export default {
    validateBody: (schema) => {
        return (req, res, next) => {
            const result = Joi.validate(req.body, schema);
            if(result.error) {
                return res.status(400).json(result.error);
            }
            // req.value.body instead of req.value
            if(!req.value) {req.value = {}; }
            req.value['body'] = result.value;
            next();
        }
    },

    schemas: {
        authSchema: Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().min(3).required(),
            firstName: Joi.string().required(),
            lastName: Joi.string().required()
        })
    }
}