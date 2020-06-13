const joi = require('@hapi/joi');

const schemaManager = joi.object({
    name: joi.string().required(),
    email: joi.string().required().email(),
    password: joi.string().min(6).max(12).required()
})

const schemaManagerLogin = joi.object({
    email: joi.string().required().email(),
    password: joi.string().required()
})

module.exports = {
    schemaManager,
    schemaManagerLogin
}