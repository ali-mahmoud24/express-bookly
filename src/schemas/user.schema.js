const userCreateSchema = {
  type: 'object',
  required: ['firstName', 'lastName', 'email', 'password'],
  additionalProperties: false,
  properties: {
    firstName: { type: 'string', minLength: 2 },
    lastName: { type: 'string', minLength: 2 },
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 6 },
    isAdmin: { type: 'boolean' },
  },
};

const userUpdateSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    firstName: { type: 'string', minLength: 2 },
    lastName: { type: 'string', minLength: 2 },
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 6 },
    isAdmin: { type: 'boolean' },
  },
};

const userSelfUpdateSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    firstName: { type: 'string', minLength: 2 },
    lastName: { type: 'string', minLength: 2 },
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 6 },
  },
};

const userRegisterSchema = {
  type: 'object',
  required: ['firstName', 'lastName', 'email', 'password'],
  additionalProperties: false,
  properties: {
    firstName: { type: 'string', minLength: 2 },
    lastName: { type: 'string', minLength: 2 },
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 6 },
  },
};

const userLoginSchema = {
  type: 'object',
  required: ['email', 'password'],
  additionalProperties: false,
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 6 },
  },
};

module.exports = {
  userCreateSchema,
  userUpdateSchema,
  userSelfUpdateSchema,
  userRegisterSchema,
  userLoginSchema,
};
