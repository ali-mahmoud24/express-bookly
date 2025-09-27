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
    // Optional profile fields for user self-update
    phoneNumber: { type: 'string' },
    address: { type: 'string', maxLength: 255 },
    bio: { type: 'string', maxLength: 500 },
    birthDate: { type: 'string', format: 'date' },
    gender: { type: 'string', enum: ['male', 'female'] },
    language: { type: 'string' },
    country: { type: 'string' },
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
