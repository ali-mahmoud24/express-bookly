const authorCreateSchema = {
    type: 'object',
    required: ['name'],
    additionalProperties: false,
    properties: {
        name: { type: 'string', minLength: 1 },
        bio: { type: 'string', maxLength: 1000 },
        birthDate: { type: 'string', format: 'date' },
        nationality: { type: 'string', maxLength: 100 },
        books: {
            type: 'array',
            items: {
                type: 'string',
                pattern: '^[a-fA-F0-9]{24}$', // MongoDB ObjectId
            },
        },
    },
};

const authorUpdateSchema = {
    type: 'object',
    additionalProperties: false,
    minProperties: 1,
    properties: {
        name: { type: 'string', minLength: 1 },
        bio: { type: 'string', maxLength: 1000 },
        birthDate: { type: 'string', format: 'date' },
        nationality: { type: 'string', maxLength: 100 },
        books: {
            type: 'array',
            items: {
                type: 'string',
                pattern: '^[a-fA-F0-9]{24}$',
            },
        },
    },
};

module.exports = {
    authorCreateSchema,
    authorUpdateSchema,
};
