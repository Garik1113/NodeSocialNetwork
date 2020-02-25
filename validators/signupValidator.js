const { body, validationResult } = require('express-validator');

const SignupValidationRules = () => {
  return [
    body('name')
      .not()
      .isEmpty()
      .withMessage('Name is required'),
    body('surname')
      .not()
      .isEmpty()
      .withMessage('Surname is required'),
    body('age')
      .isNumeric()
      .withMessage('Age must be numeric'),
    body('email')
      .isEmail()
      .withMessage('Invalid Email')
      .not()
      .isEmpty()
      .withMessage('Email is requred'),
    body('password')
      .not()
      .isEmpty()
      .withMessage('Password is requred')
      .isLength({ min: 6, max: 12 })
      .withMessage(
        'Password must be not less than 6 simbols and not more than 12 symbols'
      ),
    body('confirmPassword')
      .not()
      .isEmpty()
      .withMessage('You must confirm password')
      .custom((value, { req }) => value === req.body.password)
      .withMessage('Password are not the same')
  ];
};

const signupValidate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const user = {
    name: req.body.name,
    surname: req.body.surname,
    age: req.body.age,
    email: req.body.email,
  
  }

  res.render('signup', { errors: errors.mapped(), mailExistError: '', user });
};



module.exports = {
  SignupValidationRules,
  signupValidate
};
