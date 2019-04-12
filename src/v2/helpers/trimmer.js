export default {

  trimmer(req, res, next) {
    const trimmerContent = {};
    const { body } = req;
    Object.keys(body).forEach((keys) => {
      const value = body[keys];
      Object.assign(trimmerContent, { [keys]: value.trim() });
    });
    req.body = trimmerContent;
    next();
  },
};
