const managerModel = require('../models/manager.model');
const schem = require('../models/manager.schema');
const pass = require('../security/crypt')
const token = require('../security/jwt.token')

exports.createManager =  async (req, res) => {
    try {
        console.log("New manager being registered")

        const joiCheck = schem.schemaManager.validate(req.body);
        if (joiCheck.error) {
            console.log(joiCheck.error)
            return res.status(412).json("Please, fill all required fields");
        }

        const doEmailExist = await managerModel.findOne({email: req.body.email})
        if (doEmailExist) {
            return res.status(400).json("Email already registered")
        }

        const encryptedPassword = await pass.encrypter(req.body.password);
        req.body.password = encryptedPassword;

        const newManager = await managerModel.create(req.body);
        res.status(201).json(newManager);
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

exports.getManagersList = async (req, res, next) => {
    try {
        console.log("Getting all managers registered")

        const allManagers = await managerModel.find({});
        if (allManagers && allManagers.length > 0) {
            res.status(200).json(allManagers);
        } else {
            res.status(404).json("No managers in database");
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
}

exports.getManagerById = async (req, res, next) => {
    try {
        console.log("Getting manager by Id")

        const manager = await managerModel.findById((req.params.manager_id))
        if (manager) {
            res.status(200).json(manager);
        } else {
            res.status(404).json("No managers with provided Id");
        }
    }
    catch (err) { 
        console.log(err)
        await res.status(500).json("Please, provide a valid Id");
    };
}

exports.updateManagerById = async (req, res, next) => {
    try {
        console.log("Updating manager info")

        let updatedManager = await managerModel.findByIdAndUpdate(
            req.params.manager_id,
            req.body,
            { useFindAndModify: false }
        );
        if (updatedManager) {
            res.status(201).json(updatedManager)
        } else {
            res.status(400).json("Id not found");
        };
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err);
    };
}

exports.deleteManagerById = async (req, res, next) => {
    try {
        console.log("Deleting a Manager")

        const deleteManager = await managerModel.findByIdAndDelete(req.params.manager_id);
        if (deleteManager) {
            res.status(200).json(deleteManager)
        } else {
            res.status(404).json("Manager not found");
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
}

exports.loginManager = async (req, res, next) => {
    try {
        console.log("Manager login")

        const joiCheck = schem.schemaManagerLogin.validate(req.body);
        if (joiCheck.error) {
            console.log(joiCheck.error)
            return res.status(412).json("Please, fill all required fields");
        }

        const manager = await managerModel.findOne({email: req.body.email});
        if (!manager) {
            return res.status(400).json("Email not registered")
        }

        const validatePassword = await pass.comparison(req.body.password, manager.password);
        if (!validatePassword) {
            return res.status(401).json("Incorrect password")
        }

        const authToken = await token.securityToken(manager)
        res.header('auth-token', authToken);

        res.status(201).json(manager);
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
}