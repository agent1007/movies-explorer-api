const Movie = require('../models/movie');
const BadRequestError = require('../errors/bad-request-error');
// const UnauthorizedError = require('../errors/unauthorized-error');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');
// const ConflictingRequestError = require('../errors/conflicting-request-error');

module.exports.getMovies = (req, res, next) => {
  const { owner } = req.body;
  Movie.find().then((user) => {
    if (!req.user._id === owner) {
      throw new NotFoundError('Фильмы по указанному _id пользователя не найдены.');
    }
    return res.send(user);
  })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new BadRequestError('Передан _id в неверном формате.'));
      } else {
        next(err);
      }
    });
};

// module.exports.createMovie = (req, res, next) => {
//   const {
//     country, director, duration, year, description,
//     image, trailer, nameRU, nameEN, thumbnail, movieId,
//   } = req.body;
//   Movie.index().then((movies) => {
//     if (movies) {
//       next(new ConflictingRequestError('Фильм уже добавлен.'));
//     } else {
//       return Movie.create({
//         country,
//         director,
//         duration,
//         year,
//         description,
//         image,
//         trailer,
//         nameRU,
//         nameEN,
//         thumbnail,
//         movieId,
//         owner: req.user._id,
//       }).then((movie) => res.send(movie))
//         .catch((err) => {
//           if (err.name === 'ValidationError') {
//             next(new BadRequestError('Переданы некоректные данные при создании фильма.'));
//           } else {
//             console.log(err);
//             next(err);
//           }
//         });
//     }
//   });
// };

module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description,
    image, trailer, nameRU, nameEN, thumbnail, movieId,
  } = req.body;
  return Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  }).then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некоректные данные при создании фильма.'));
      } else if (movieId) {
        next(new BadRequestError('Фильм уже добавлен.'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  return Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        next(new NotFoundError('Фильм с указанным _id не найден.'));
      } else if (!movie.owner.equals(req.user._id)) {
        next(new ForbiddenError('Нельзя удалять чужие фильмы!'));
      } else {
        Movie.findByIdAndRemove(movieId)
          .then((movies) => {
            res.send(movies);
          });
      }
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new BadRequestError('Переданы некоректные данные при удалении фильма.'));
      } else {
        next(err);
      }
    });
};
