const Router = require('express');
const {body} = require('express-validator');
const materialsController = require('./controllers/materialsController');
/*
const controller = require('./controller');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/role');
const imgValidation = require('../middlewares/validation')
const accessMiddleware = require('../middlewares/access-category');
*/
const router = new Router();

router.get('/materials', materialsController.getAllMaterials)
router.get('/materials/:id', materialsController.getOneMaterial)
router.post('/materials', materialsController.addMaterial)
router.put('/materials', materialsController.updateMaterial)

router.delete('/materials', materialsController.deleteMaterial)
/*
router.post('/registration', imgValidation, body('email').isEmail(), controller.registration);
router.post('/login', controller.login);
router.post('/logout', controller.logout);
router.get('/refresh', controller.refresh);
router.get('/getTasks', authMiddleware, accesMiddleware, controller.gettingTasks);
router.get('/get-task', authMiddleware, controller.getTask);
router.get('/scoreBoard',authMiddleware, controller.scoreBoard);
router.get('/profile', authMiddleware, controller.profile);
router.get('/administration', authMiddleware, roleMiddleware(['Admin']), controller.administration);
*/

module.exports = router