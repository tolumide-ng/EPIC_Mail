const regString = (/^([a-zA-Z\s]){3,}$/);
const regEmail = (/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/);
const regAlphanumeric = (/^([a-zA-Z0-9\-.,\s]{3,})$/);

const Validator = {
  createGroupValidator(req, res, next) {
    const verifiedContent = {};
    const errorContents = [];
    const { body } = req;
    const missingKeys = [];

    // Ensure all details are supplied
    const requiredDetails = ['role', 'name'];
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

    // Ensure the cotnents of each key is a valid entry
    Object.keys(body).forEach((key) => {
      const value = body[key];
      const strings = (key === 'name' || key === 'role');
      if (value.length < 3) {
        return res.status(400).json({ status: 400, error: `Length of ${key} cannot be less than 3` });
      }
      if (strings) {
        const validString = regAlphanumeric.test(value);
        if (!validString) {
          errorContents.push(`${key} can only contain letters numbers, letters, (-), (.), and (,) `);
        }
        Object.assign(verifiedContent, { [key]: value });
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

  addGroupMemberValidator(req, res, next) {
    const verifiedContent = {};
    const errorContents = [];
    const { body } = req;
    const missingKeys = [];

    const requiredDetails = ['userEmailAddress', 'userRole'];
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
      const value = body[key];
      if (value.length < 3) {
        return res.status(400).json({ status: 400, error: 'Length of the value cannot be less than 3' });
      }
      if (key === 'userEmailAddress') {
        const validEmail = regEmail.test(value);
        if (!validEmail) {
          return res.status(400).json({ status: 400, error: `${key} must be a valid email` });
        }
        Object.assign(verifiedContent, { [key]: value });
      }
      if (key === 'userRole') {
        const validString = regAlphanumeric.test(value);
        if (!validString) {
          return res.status(400).json({ status: 400, error: `${key} must be a valid string` });
        }
        Object.assign(verifiedContent, { [key]: value });
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

  broadCastMessageValidator(req, res, next) {
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
    if (missingKeys.length > 0) {
      return res.status(400).json({ status: 400, error: `${missingKeys} is required` });
    }

    Object.keys(body).forEach((key) => {
      const value = body[key];
      const strings = (key === 'subject' || key === 'message');
      if (value.length < 3) {
        return res.status(400).json({ status: 400, error: `Length of the ${value} cannot be less than 3` });
      }
      if (strings) {
        const validStrings = regAlphanumeric.test(value);
        console.log(validStrings);
        if (!validStrings) {
          errorContents.push(`${key} can only be string`);
        }
        Object.assign(verifiedContent, { [key]: value });
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

  renameGroupValidator(req, res, next) {
    const verifiedContent = {};
    // const errorContents = [];
    const { body } = req;
    const missingKeys = [];

    // Ensure all details are supplied
    const requiredDetails = ['name'];
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
      const value = body[key];

      if (value.length < 3) {
        return res.status(400).json({ status: 400, error: `Length of ${key} cannot be less than 3` });
      }
      if (key === 'name') {
        const validAlphaNumeric = regAlphanumeric.test(value);
        // if (!validAlphaNumeric) {
        //   errorContents.push(`Please ensure ${key} is a valid group name`);
        // }
        Object.assign(verifiedContent, { [key]: value });
      }
    });
    // if (errorContents.length > 0) {
    //   return res.status(400).json({
    //     status: 400,
    //     error: `${errorContents}`,
    //   });
    // }
    if (!req.value) { req.value = {}; }
    req.value.body = req.body;
    next();
  },
};

export default Validator;
