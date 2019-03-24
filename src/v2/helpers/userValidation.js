const regString = (/^([a-zA-Z]){3,}$/);
const regEmail = (/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/);
const regAlphanumeric = (/^([a-zA-Z0-9\-.]{6,})$/);

const Validator = {
  signUpValidator(req, res, next) {
    const verfiedContent = {};
    const errorContents = [];
    const { body } = req;
    const missingKeys = [];

    // Ensure all details are supplied
    const requiredDetails = ['firstName', 'lastName', 'email', 'secondaryEmail', 'password'];
    requiredDetails.forEach((detail) => {
      const found = Object.keys(body).find(objectKey => objectKey === detail);
      if (!found) {
        missingKeys.push(detail);
      }
    });
    if (missingKeys.length > 0) {
      return res.status(400).json({ status: 400, error: `${missingKeys} is required` });
    }

    // Ensure the content of each key is a valid entry
    Object.keys(body).forEach((key) => {
      const strings = (key === 'firstName' || key === 'lastName');
      const mails = (key === 'email' || key === 'secondaryEmail');
      const value = body[key];
      if (value.length <= 3) {
        return res.status(444).json({ status: 444, error: 'Length of the value cannot be less than 3' });
      }
      if (key === 'password') {
        const validPassword = regAlphanumeric.test(value);
        if (!validPassword) {
          errorContents.push(`${key} must be alphanumeric and length nust be more than 6`);
        }
        Object.assign(verfiedContent, { [key]: value });
      }
      if (mails) {
        const validEmail = regEmail.test(value);
        if (!validEmail) {
          errorContents.push(`Please ensure ${key} is a valid email`);
        }
        Object.assign(verfiedContent, { [key]: value.toLowerCase() });
      }
      if (strings) {
        const validString = regString.test(value);
        if (!validString) {
          errorContents.push(`Please ensure ${key} is a valid string`);
        }
        Object.assign(verfiedContent, { [key]: value[0].toUpperCase() + value.slice(1).toLowerCase() });
      }
    });
    if (errorContents.length > 0) {
      return res.status(444).json({
        status: 444,
        error: `${errorContents}`,
      });
    }
    if (!req.value) { req.value = {}; }
    req.value.body = req.body;
    next();
  },
};


export default Validator;
