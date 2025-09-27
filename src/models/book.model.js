const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Author',
      required: true,
    },
    description: { type: String },
    category: { type: String },
    copiesAvailable: {
      type: Number,
      default: 1,
      min: 0,
    },
    borrowedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.models.Book || mongoose.model('Book', bookSchema);
