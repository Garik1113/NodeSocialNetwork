const { body, validationResult } = require('express-validator');

const profileValidationRules = () => {
    return [
        body('name')
            .not()
            .isEmpty()
            .withMessage("Name cant be empty"),
        body('surname')
            .not()
            .isEmpty()
            .withMessage('Surname cant be empty'),
        body('age')
            .not()
            .isEmpty()
            .withMessage("Age cant be empty")
            .isNumeric()
            .withMessage("Age must be numberic")
    ]
}

const validateProfile = (req, res, next) => {
    const errors = validationResult(profileValidationRules)
    
    if(errors.isEmpty()){
        return next()
    }
    
    const {name, surname, age} = req.body.isNumeric
    res.send({name, surname, age})
}

module.exports = {
    profileValidationRules,
    validateProfile
}