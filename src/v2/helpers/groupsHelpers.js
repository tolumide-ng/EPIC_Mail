import Joi from 'joi';

export default {
    validateBody: schema => (req, res, next) => {
        const result = Joi.validate(req.body, schema);
        if(result.error) { 
            return res.status(422).json({ status: 422, error: result.error });
        }
        if(!req.value) { req.value = {}; }
        req.value.body = result.value;
        next();
    },

    schemas: {
        createGroup: Joi.object().keys({
            name: Joi.string().required(),
            role: Joi.string().required()
        }),

        groupMember: Joi.object().keys({
            id: Joi.number().required(),
            userId: Joi.number().required(),
            userRole: Joi.string().required()
        })
    }
}