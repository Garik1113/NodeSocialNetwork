const { body, validationResult } = require('express-validator');

const loginValidationRules = () => {
  return [
    body('email')
      .not()
      .isEmpty()
      .withMessage('Email is Required')
      .isEmail()
      .withMessage('Invalid email'),
    body('password')
      .not()
      .isEmpty()
      .withMessage('Password is required')
  ];
};

const loginValidate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

 const email = req.body.email;
  res.render('login', {
    errors: errors.mapped(),
    mailExistError: '',
    userError: '',
    email: email
  });
};

module.exports = {
  loginValidationRules,
  loginValidate
};
