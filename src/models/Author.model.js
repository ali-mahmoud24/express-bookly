const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
    },
    birthDate: {
        type: Date,
    },
    nationality: {
        type: String,
    },
    books: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
    }],
});

module.exports = mongoose.model('Author', authorSchema);
