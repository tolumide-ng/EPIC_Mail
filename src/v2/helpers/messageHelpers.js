import Joi from 'joi';

export default {
  validateBody: schema => (req, res, next) => {
    const result = Joi.validate(req.body, schema);
    if (result.error) {
      return res.status(422).json({ status: 422, error: result.error });
    }
    if (!req.value) { req.value = {}; }
    req.value.body = result.value;
    next();
  },

  schemas: {
    composeMail: Joi.object().keys({
      subject: Joi.string().required(),
      message: Joi.string().required(),
      parentMessageId: Joi.number(),
      receiverEmail: Joi.string().regex(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/),
    }),
  },
};
