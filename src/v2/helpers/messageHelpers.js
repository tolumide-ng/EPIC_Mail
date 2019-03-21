import Joi from 'joi';

export default {
  composeMail(req, res, next) {
    const composeMailSchema = Joi.object().keys({
      subject: Joi.string().required(),
      message: Joi.string().required(),
      receiverEmail: Joi.string().regex(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/),
    })

    const result = Joi.validate(req.body, composeMailSchema);

    if (result.error) {
      return res.status(400).json({ status: 400, error: 'Only subject and message are required, include receiverEmail if the message is not a draft' });
    }

    if (!req.value) { req.value = {}; }
    req.value.body = result.value;
    next();
  },
};
