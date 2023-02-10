const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const { errors } = require('celebrate');
const { DB_ADDRESS } = require('./utils/config');
const { userRoutes } = require('./routes/users');
const { movieRoutes } = require('./routes/movies');
const { login, createUser } = require('./controllers/user');
const { auth } = require('./middlewares/auth');
const { signInValidation, createUserValidation } = require('./validators/user');
const { NotFoundError } = require('./utils/NotFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

async function start() {
  try {
    await mongoose.connect(DB_ADDRESS, {});
  } catch (err) {
    console.log(err);
  }
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const app = express();
mongoose.set({ runValidators: true });
app.use(cors());

app.use(express.json());
app.use(helmet());
app.use(limiter);

start();

const { PORT = 3000 } = process.env;

app.use(requestLogger);

app.post('/signin', signInValidation, login);
app.post('/signup', createUserValidation, createUser);

app.use(auth);

app.use(userRoutes);
app.use(movieRoutes);

app.use('*', (req, res, next) => next(new NotFoundError('Страница не найдена')));

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'Internal server error' : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`server listen on port ${PORT}`);
});
