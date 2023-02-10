const Movie = require('../models/movie');
const { ForbiddenError, forbiddenMessage } = require('../utils/ForbiddenError');
const { NotFoundError, notFoundMessage } = require('../utils/NotFoundError');
const { BadRequestError, badRequestMessage } = require('../utils/BadRequestError');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .populate('owner')
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => Movie.populate(movie, { path: 'owner' }))
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(badRequestMessage));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .populate('owner')
    .then((movie) => {
      if (!movie) {
        next(new NotFoundError(notFoundMessage));
      }
      if (movie.owner._id.toString() !== req.user._id) {
        throw new ForbiddenError(forbiddenMessage);
      }
      return movie.remove()
        .then((myMovie) => res.send(myMovie))
        .catch((err) => {
          if (err.name === 'CastError') {
            next(new BadRequestError(badRequestMessage));
          } else {
            next(err);
          }
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(badRequestMessage));
      } else {
        next(err);
      }
    });
};
