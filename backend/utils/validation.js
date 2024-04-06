const { validationResult } = require('express-validator');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.path] = error.msg);

    const err = Error("Bad request.");
    err.errors = errors;
    err.status = 400;
    err.title = "Bad request.";
    next(err);
  }
  next();
};

const validDate = (date) => {
  if (!date){
    return false
  }  if (date.getTime() > Date.now()) {
    return true
  } else {
    return false
  }
}

const formatDate = (date) => {
  return `${date.getFullYear()}-${date.getDate()}-${date.getDay()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

module.exports = {
  handleValidationErrors,
  validDate,
  formatDate
};
