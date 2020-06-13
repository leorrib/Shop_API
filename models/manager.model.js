let mongoose = require('mongoose');

let managerSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 12
    },
    admission_date: {
        type: Date,
        default: Date.now
    }
});

mongoose.pluralize(null);
const managerModel = mongoose.model(`manager_${process.env.NODE_ENV}`, managerSchema);
module.exports = managerModel;