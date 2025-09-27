const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
        required: true
    },
    description: {
        type: String
    },
    category: {
        type: String
    },
    copiesAvailable: {
        type: Number,
    }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);

