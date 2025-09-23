const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv();
addFormats(ajv); // 👈 adds "email", "uri", "date", etc.

module.exports = (schema) => {
  return (req, res, next) => {
    const validate = ajv.compile(schema);
    const valid = validate(req.body);

    if (!valid) {
      return res.status(400).json({
        status: 'error',
        errors: validate.errors.map((err) => ({
          field: err.instancePath || err.params.missingProperty,
          message: err.message,
        })),
      });
    }

    next();
  };
};
