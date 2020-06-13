const controller = require('../controllers/manager.controller')
const token = require('../security/jwt.token')

let router = require('express').Router();

router.get('/', (req, res) => {
    res.status(200).json({
        status: 'Our shop is open!',
        message: 'Welcome!'
    })
})

router.post('/managers', controller.createManager)
router.get('/managers', controller.getManagersList)
router.get('/managers/:manager_id', controller.getManagerById)
router.put('/managers/:manager_id', token.verification, controller.updateManagerById)
router.delete('/managers/:manager_id', controller.deleteManagerById)
router.post('/managers/login', controller.loginManager)
module.exports = router;