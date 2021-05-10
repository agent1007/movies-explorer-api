const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      mesages: 'Неправильный формат ссылки.',
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      mesages: 'Неправильный формат ссылки.',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      mesages: 'Неправильный формат ссылки.',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'movie',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

movieSchema.index({ owner: 1, movieId: 1 }, { unique: true });

module.exports = mongoose.model('movie', movieSchema);
