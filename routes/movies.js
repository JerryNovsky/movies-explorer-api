const express = require('express');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movie');
const { createMovieValidation, idMovieValidation } = require('../validators/movie');

const movieRoutes = express.Router();

movieRoutes.get('/movies', getMovies);
movieRoutes.post('/movies', createMovieValidation, createMovie);
movieRoutes.delete('/movies/:movieId', idMovieValidation, deleteMovie);

module.exports = { movieRoutes };
