const Router = require('express');
const router = new Router();
const controller = require('./controller');
const {body} = require('express-validator');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/role');
const imgValidation = require('../middlewares/validation')

router.post('/registration',
    imgValidation,
    body('email').isEmail(),
    body('password').isLength({min: 8, max: 30}),
    controller.registration);
router.post('/login', controller.login);
router.post('/logout', controller.logout);
router.get('/refresh', controller.refresh);
router.get('/getTasks', authMiddleware, controller.gettingTasks);
router.get('/profile',authMiddleware, controller.profile);
router.get('/administration',authMiddleware, roleMiddleware(['Admin']), controller.administration);


module.exports = router