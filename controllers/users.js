const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const NotFoundError = require('../errors/not-found-error');
const ConflictingRequestError = require('../errors/conflicting-request-error');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId).then((user) => {
    if (!user) {
      throw new NotFoundError('Пользователь по указанному _id не найден.');
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

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findOne({ email }).then((user) => {
    if (user) {
      next(new ConflictingRequestError('Пользователь с таким email уже существует.'));
    } else {
      User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
        .then((users) => {
          if (!users) {
            throw new NotFoundError('Пользователь по указанному _id не найден.');
          }
          return res.send(users);
        })
        .catch((err) => {
          if (err.name === 'ValidationError' || err.name === 'CastError') {
            next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
          } else {
            next(err);
          }
        });
    }
  });
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Email или пароль не заданы.');
  }
  User.findOne({ email }).then((user) => {
    if (user) {
      next(new ConflictingRequestError('Пользователь уже существует.'));
    } else {
      bcrypt.hash(password, 10)
        .then((hash) => {
          User.create({
            name,
            email,
            password: hash,
          })
            .then((data) => res.send(data))
            .catch((err) => {
              if (err.name === 'ValidationError') {
                next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
              }
              if (err.name === 'MongoError' && err.code === 11000) {
                next(new ConflictingRequestError('Пользователь с таким email уже существует.'));
              }
              next(err);
            });
        });
    }
  });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.status(200).send({ token: jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' }) });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new UnauthorizedError('Переданы некорректные данные при авторизации пользователя.');
      } else {
        next(err);
      }
    });
};
