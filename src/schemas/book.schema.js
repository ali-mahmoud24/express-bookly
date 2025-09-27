const bookCreateSchema = {
    type: 'object',
    required: ['title', 'author'],
    additionalProperties: false,
    properties: {
        title: {
            type: 'string',
            minLength: 1,
        },
        author: {
            type: 'string',
            pattern: '^[0-9a-fA-F]{24}$',
        },
        description: {
            type: 'string',
            maxLength: 1000,
        },
        category: {
            type: 'string',
            maxLength: 100,
        },
        copiesAvailable: {
            type: 'integer',
            minimum: 0,
        },
    },
};

const bookUpdateSchema = {
    type: 'object',
    additionalProperties: false,
    minProperties: 1,
    properties: {
        title: {
            type: 'string',
            minLength: 1,
        },
        author: {
            type: 'string',
            pattern: '^[0-9a-fA-F]{24}$',
        },
        description: {
            type: 'string',
            maxLength: 1000,
        },
        category: {
            type: 'string',
            maxLength: 100,
        },
        copiesAvailable: {
            type: 'integer',
            minimum: 0,
        },
    },
};

module.exports = {
    bookCreateSchema,
    bookUpdateSchema,
};
