const { celebrate, Joi } = require('celebrate');
const { ObjectId } = require('mongoose').Types;
const validator = require('validator');

module.exports.validateGetCurrentUser = celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().min(2).max(200),
  }).unknown(true),
});

module.exports.validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required()
      .messages({
        'string.min': 'Минимальная длина поля "name" - 2',
        'string.max': 'Максимальная длина поля "name" - 30',
        'any.required': 'Поле "name" должно быть заполнено',
      }),
    email: Joi.string().required().custom((value, helpers) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helpers.message('Поле "email" должно быть валидным email-адресом');
    })
      .messages({
        'any.required': 'Поле "email" должно быть заполнено',
      }),
  }),
});

module.exports.validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom((value, helpers) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helpers.message('Поле "email" должно быть валидным email-адресом');
    })
      .messages({
        'any.required': 'Поле "email" должно быть заполнено',
      }),
    password: Joi.string().required().messages({
      'string.min': 'Минимальная длина пароля составляет 8 символов.',
      'any.required': 'Пароль должен быть заполнен.',
    }),
  }),
});

module.exports.validateRegistration = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom((value, helpers) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helpers.message('Поле "email" должно быть валидным email-адресом');
    })
      .messages({
        'any.required': 'Поле "email" должно быть заполнено',
      }),
    password: Joi.string().required().messages({
      'string.min': 'Минимальная длина пароля составляет 8 символов.',
      'any.required': 'Пароль должен быть заполнен.',
    }),
    name: Joi.string().min(2).max(30)
      .messages({
        'string.min': 'Минимальная длина поля "name" - 2',
        'string.max': 'Максимальная длина поля "name" - 30',
        'any.required': 'Поле "name" должно быть заполнено',
      }),
  }),
});

module.exports.validateGetMovies = celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().min(2).max(200),
  }).unknown(true),
});

module.exports.validateCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required()
      .messages({
        'any.required': 'Поле "country" должно быть заполнено',
      }),
    director: Joi.string().required()
      .messages({
        'any.required': 'Поле "director" должно быть заполнено',
      }),
    duration: Joi.number().required()
      .messages({
        'any.required': 'Поле "duration" должно быть заполнено',
      }),
    year: Joi.string().required()
      .messages({
        'any.required': 'Поле "year" должно быть заполнено',
      }),
    description: Joi.string().required()
      .messages({
        'any.required': 'Поле "description" должно быть заполнено',
      }),
    image: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Поле "image" должно быть валидным url-адресом');
    })
      .messages({
        'any.required': 'Поле "image" должно быть заполнено',
      }),
    trailer: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Поле "trailer" должно быть валидным url-адресом');
    })
      .messages({
        'any.required': 'Поле "trailer" должно быть заполнено',
      }),
    nameRU: Joi.string().required()
      .messages({
        'any.required': 'Поле "nameRU" должно быть заполнено',
      }),
    nameEN: Joi.string().required()
      .messages({
        'any.required': 'Поле "nameEN" должно быть заполнено',
      }),
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Поле "thumbnail" должно быть валидным url-адресом');
    })
      .messages({
        'any.required': 'Поле "thumbnail" должно быть заполнено',
      }),
    movieId: Joi.number().required()
      .messages({
        'any.required': 'Поле "duration" должно быть заполнено',
      }),
  }),
});

module.exports.validateDeleteMovie = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().custom((value, helpers) => {
      if (ObjectId.isValid(value)) {
        return value;
      }
      return helpers.message('Невалидный id пользователя');
    }),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().min(2).max(200),
  }).unknown(true),
});
