const bcrypt = require('bcrypt');
const saltRounds = 4;

exports.encrypter = async (password) => {
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(password, salt);
}

exports.comparison = async (input, encrypted) => {
    return bcrypt.compare(input, encrypted)
}