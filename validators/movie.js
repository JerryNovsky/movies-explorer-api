const { celebrate, Joi } = require('celebrate');
const { urlRegExp } = require('../utils/urlRegExp');

module.exports.createMovieValidation = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().regex(urlRegExp).required(),
    trailerLink: Joi.string().regex(urlRegExp).required(),
    thumbnail: Joi.string().regex(urlRegExp).required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),

  }),
});

module.exports.idMovieValidation = celebrate({
  params: Joi.object({
    movieId: Joi.string().hex().length(24).required(),
  }).required(),
});
