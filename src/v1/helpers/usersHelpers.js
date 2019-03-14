import Joi from 'joi';


export default {
  validateBody: schema => (req, res, next) => {
    const result = Joi.validate(req.body, schema);
    if (result.error) {
      return res.status(400).json({ status: 400, error: result.error });
    }
    // req.value.body instead of req.body
    if (!req.value) { req.value = {}; }
    req.value.body = result.value;
    next();
  },

  schemas: {
    authSchema: Joi.object().keys({
      email: Joi.string().regex(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/).required(),
      password: Joi.string().min(3).required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
    }),

    loginSchema: Joi.object().keys({
      email: Joi.string().regex(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/).required(),
      password: Joi.string().required(),
    }),
  },
};
