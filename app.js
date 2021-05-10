require('dotenv').config();

const express = require('express');

const { PORT = 3000 } = process.env;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

const NotFoundError = require('./errors/not-found-error');

const { createUser, login } = require('./controllers/users');

const { validateLogin, validateRegistration } = require('./middlewares/validatons');

const auth = require('./middlewares/auth');

app.use(cors());
app.use(bodyParser.json());

app.use(requestLogger);
mongoose.connect('mongodb://localhost:27017/bitfilmsdb',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    autoIndex: true,
  });

app.post('/signup', validateRegistration, createUser);
app.post('/signin', validateLogin, login);

app.use(auth);
app.use('/', require('./routes/index'));

app.use((req, res, next) => {
  next(new NotFoundError(`Запрашиваемый ресурс по адресу '${req.path}' не найден`));
});

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
