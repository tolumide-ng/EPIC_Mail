import Joi from 'joi';

export default {
  createGroup(req, res, next) {
    const createGroupSchema = Joi.object().keys({
      name: Joi.string().required(),
      role: Joi.string().required(),
    });

    const result = Joi.validate(req.body, createGroupSchema);

    if (result.error) {
      return res.status(400).json({ status: 400, error: 'Only name and role are required' });
    }
    if (!req.value) { req.value = {}; }
    req.value.body = result.value;
    next();
  },

  addGroupMember(req, res, next) {
    const addGroupMemberSchema = Joi.object().keys({
      userEmailAddress: Joi.string().regex(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/).required(),
      userRole: Joi.string().required(),
    });

    const result = Joi.validate(req.body, addGroupMemberSchema);

    if (result.error) {
      return res.status(400).json({ status: 400, error: 'Only userEmailAddress and userRole are required' });
    }
    if (!req.value) { req.value = {}; }
    req.value.body = result.value;
    next();
  },

  broadCastMessage(req, res, next) {
    const broadCastMessageSchema = Joi.object().keys({
      subject: Joi.string().required(),
      message: Joi.string().required(),
    });

    const result = Joi.validate(req.body, broadCastMessageSchema);

    if (result.error) {
      return res.status(400).json({ status: 400, error: 'Only subject and message are required' });
    }
    if (!req.value) { req.value = {}; }
    req.value.body = result.value;
    next();
  },

  renameGroup(req, res, next) {
    const renameGroupSchema = Joi.object().keys({
      name: Joi.string().required(),
    });

    const result = Joi.validate(req.body, renameGroupSchema);

    if (result.error) {
      return res.status(400).json({ status: 400, error: 'Only name is required' });
    }
    if (!req.value) { req.value = {}; }
    req.value.body = result.value;
    next();
  },
};
