import Joi from 'joi';


export default {
  signUp(req, res, next) {
    const authSchema = Joi.object().keys({
      email: Joi.string().regex(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/).required(),
      password: Joi.string().min(3).required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      secondaryEmail: Joi.string().regex(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/).required(),
    });

    const result = Joi.validate(req.body, authSchema);

    if (result.error) {
      return res.status(400).json({ status: 400, error: 'Only email, password, firstName, lastName and secondaryEmail are required' });
    }

    if (!req.value) { req.value = {}; }
    req.value.body = result.value;
    next();
  },

  login(req, res, next) {
    const loginSchema = Joi.object().keys({
      email: Joi.string().regex(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/).required(),
      password: Joi.string().min(3).required(),
    });

    const result = Joi.validate(req.body, loginSchema);

    if (result.error) {
      return res.status(400).json({ status: 400, error: 'Only email and password are required' });
    }

    if (!req.value) { req.value = {}; }
    req.value.body = result.value;
    next();
  },

};
