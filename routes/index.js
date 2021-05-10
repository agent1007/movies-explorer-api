const router = require('express').Router();

const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { updateUser, getCurrentUser } = require('../controllers/users');
const { validateGetMovies, validateCreateMovie, validateDeleteMovie } = require('../middlewares/validatons');
const { validateUpdateUser, validateGetCurrentUser } = require('../middlewares/validatons');

router.get('/movies', validateGetMovies, getMovies);

router.post('/movies', validateCreateMovie, createMovie);

router.delete('/movies/:movieId', validateDeleteMovie, deleteMovie);

router.get('/users/me', validateGetCurrentUser, getCurrentUser);

router.patch('/users/me', validateUpdateUser, updateUser);

module.exports = router;
