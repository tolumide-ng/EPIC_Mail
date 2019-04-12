// const regString = (/^([a-zA-Z]){3,}$/);
const regEmail = (/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/);
// const regAlphanumeric = (/^([a-zA-Z0-9\-.]{6,})$/);

const Validator = {
  composeMailValidator(req, res, next) {
    const verifiedContent = {};
    const errorContents = [];
    const { body } = req;
    const missingKeys = [];

    // Ensure all details are supplied

    const requiredDetails = ['subject', 'message'];
    requiredDetails.forEach((detail) => {
      const found = Object.keys(body).find(objectKey => objectKey === detail);
      if (!found) {
        missingKeys.push(detail);
      }
    });
    if (missingKeys.length === 1) {
      return res.status(400).json({ status: 400, error: `${missingKeys} is required` });
    }
    if (missingKeys.length > 1) {
      return res.status(400).json({ status: 400, error: `${missingKeys} are required` });
    }

    // Ensure the content of each key is a valid entry
    Object.keys(body).forEach((key) => {
      const value = body[key];
      if (key === 'message') {
        if (key.length < 1) {
          errorContents.push(`${key} cannot be empty`);
        }
        Object.assign(verifiedContent, { [key]: value });
      }
      if (key === 'receiverEmail' || key === 'receiveremail') {
        const validEmail = regEmail.test(value);
        if (!validEmail) {
          errorContents.push(`${key} must be a valid email`);
        }
      }
      if (key === 'subject') {
        Object.assign(verifiedContent, { [key]: value });
      }
    });
    if (errorContents.length > 0) {
      return res.status(400).json({ status: 400, error: `${errorContents}` });
    }
    if (!req.value) { req.value = {}; }
    req.value.body = req.body;
    next();
  },
};

export default Validator;
