const {Joi, celebrate} = require('celebrate');
const validator = require('validator');

const validateUrl = ((value, helpers) => validator.isURL(value) ? value : helpers.error('string.uri'));

const validateClothingItem = celebrate({
    body: Joi.object().keys({
        name: Joi.string().min(2).max(30).required().messages({
            'string.empty': 'The name field must be filled in',
            'string.min': 'The name must be at least 2 characters long',
            'string.max': 'The name must be at most 30 characters long',
            'any.required': 'The name field is required',
        }),
        imageUrl: Joi.string().uri().required().custom(validateUrl).messages({
            'string.empty': 'The imageUrl field must be filled in',
            'string.uri': 'The imageUrl must be a valid URL',
        }),
        weather: Joi.string().valid('hot', 'warm', 'cold').required().messages({
            'string.empty': 'The weather field must be filled in',
            'any.only': 'The weather must be one of the following: hot, warm, cold',
            'any.required': 'The weather field is required',
        }),
    }),
});

const validateUserCreation = celebrate({
    body: Joi.object().keys({
        name: Joi.string().min(2).max(30).required().messages({
            'string.empty': 'The name field must be filled in',
            'string.min': 'The name must be at least 2 characters long',
            'string.max': 'The name must be at most 30 characters long',
            'any.required': 'The name field is required',
        }),
        avatar: Joi.string().uri().required().custom(validateUrl).messages({
            'string.empty': 'The imageUrl field must be filled in',
            'string.uri': 'The imageUrl must be a valid URL',
        }),
        email: Joi.string().email().required().messages({
            'string.empty': 'The email field must be filled in',
            'string.email': 'The email must be a valid email address',
            'any.required': 'The email field is required',
        }),
        password: Joi.string().required().messages({
            'string.empty': 'The password field must be filled in',
            'any.required': 'The password field is required',
        }),
    }),
});

const validateLogin = celebrate({
    body: Joi.object().keys({
        email: Joi.string().email().required().messages({
            'string.empty': 'The email field must be filled in',
            'string.email': 'The email must be a valid email address',
            'any.required': 'The email field is required',
        }),
        password: Joi.string().required().messages({
            'string.empty': 'The password field must be filled in',
            'any.required': 'The password field is required',
        }),
    }),
});

const validateUserUpdate = celebrate({
    body: Joi.object().keys({
        name: Joi.string().min(2).max(30).required().messages({
            'string.empty': 'The name field must be filled in',
            'string.min': 'The name must be at least 2 characters long',
            'string.max': 'The name must be at most 30 characters long',
            'any.required': 'The name field is required',
        }),
        avatar: Joi.string().uri().required().custom(validateUrl).messages({
            'string.empty': 'The imageUrl field must be filled in',
            'string.uri': 'The imageUrl must be a valid URL',
        }),
    }),
});


const validateIdParams = celebrate({
    params: Joi.object().keys({
        itemId: Joi.string().hex().length(24).required().messages({
            'string.empty': 'The id field must be filled in',
            'string.hex': 'The id must be a valid hexadecimal string',
            'string.length': 'The id must be 24 characters long',
            'any.required': 'The id field is required',
        }),
    }),
});

module.exports = {
    validateClothingItem,
    validateUserCreation,
    validateLogin,
    validateIdParams,
    validateUserUpdate,
};