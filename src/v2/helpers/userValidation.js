const regString = (/^([a-zA-Z\s]){3,}$/);
const regEmail = (/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/);
const regAlphanumeric = (/^([a-zA-Z0-9\-.\s]{6,})$/);

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
    if (missingKeys.length === 1) {
      return res.status(400).json({ status: 400, error: `${missingKeys} is required` });
    }

    if (missingKeys.length > 1) {
      return res.status(400).json({ status: 400, error: `${missingKeys} are required` });
    }

    // Ensure the content of each key is a valid entry
    Object.keys(body).forEach((key) => {
      const strings = (key === 'firstName' || key === 'lastName');
      const mails = (key === 'email' || key === 'secondaryEmail');
      const value = body[key];
      if (value.length < 3) {
        const newLocal = 'Length of the value cannot be less than 3';
        return res.status(400).json({ status: 400, error: newLocal });
      }
      if (key === 'password') {
        const validPassword = regAlphanumeric.test(value);
        if (!validPassword) {
          errorContents.push(`${key} must be alphanumeric and length must be more than 6`);
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
      return res.status(400).json({
        status: 400,
        error: `${errorContents}`,
      });
    }
    if (!req.value) { req.value = {}; }
    req.value.body = req.body;
    next();
  },

  loginValidator(req, res, next) {
    const verfiedContent = {};
    const errorContents = [];
    const { body } = req;
    const missingKeys = [];

    // Ensure all details are supplied
    const requiredDetails = ['email', 'password'];
    requiredDetails.forEach((detail) => {
      const found = Object.keys(body).find(objectKey => objectKey === detail);
      if (!found) {
        missingKeys.push(detail);
      }
    });
    if (missingKeys.length > 0) {
      return res.status(400).json({ status: 400, error: `${missingKeys[0]} is required` });
    }

    // Ensure the content of each key is a valid entry
    Object.keys(body).forEach((key) => {
      const value = body[key];
      if (key === 'password') {
        // const validPassword = regAlphanumeric.test(value);
        if (!value) {
          errorContents.push(`${key} cannot be empty`);
          // errorContents.push(`${key} must be alphanumeric and length nust be more than 6`);
        }
        Object.assign(verfiedContent, { [key]: value });
      }
      if (key === 'email') {
        const validEmail = regEmail.test(value);
        if (!validEmail) {
          errorContents.push(`Please ensure ${key} is a valid email`);
        }
        Object.assign(verfiedContent, { [key]: value.toLowerCase() });
      }
    });
    if (errorContents.length > 0) {
      return res.status(400).json({
        status: 400,
        error: `${errorContents}`,
      });
    }
    if (!req.value) { req.value = {}; }
    req.value.body = req.body;
    next();
  },

  resetValidator(req, res, next) {
    const verifiedContent = {};
    const errorContents = [];
    const { body } = req;
    const missingKeys = [];

    // Ensure all details are supplied
    const requiredDetail = ['email'];
    requiredDetail.forEach((detail) => {
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
      const value = body[key];
      if (key === 'email') {
        const validEmail = regEmail.test(value);
        if (!validEmail) {
          errorContents.push(`Please ensure ${key} is a valid email`);
        }
        Object.assign(verifiedContent, { [key]: value.toLowerCase() });
      }
    });
    if (errorContents.length > 0) {
      return res.status(400).json({
        status: 400,
        error: `${errorContents}`,
      });
    }
    if (!req.value) { req.value = {}; }
    req.value.body = req.body;
    next();
  },
};


export default Validator;
