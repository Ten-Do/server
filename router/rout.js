const Router = require('express');
const {body} = require('express-validator');
const materialsController = require('./controllers/materialsController');
const usersController = require('./controllers/usersController');
const tokensController = require('./controllers/tokensController')
const imgValidation = require('../middlewares/validation')
/*
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/role');
const accessMiddleware = require('../middlewares/access-category');
*/
const router = new Router();

router.get('/materials', materialsController.getAllMaterials)
router.get('/materials/:id', materialsController.getOneMaterial)
router.post('/materials', materialsController.addMaterial)
router.put('/materials', materialsController.updateMaterial)
router.delete('/materials', materialsController.deleteMaterial)
router.post('/registration', body('email').isEmail(), usersController.registration);
router.post('/login', tokensController.login);
router.delete('/logout', tokensController.logout);
router.get('/refresh', tokensController.refresh);
/*
router.get('/getTasks', authMiddleware, accesMiddleware, controller.gettingTasks);
router.get('/get-task', authMiddleware, controller.getTask);
router.get('/scoreBoard',authMiddleware, controller.scoreBoard);
router.get('/profile', authMiddleware, controller.profile);
router.get('/administration', authMiddleware, roleMiddleware(['Admin']), controller.administration);
*/

module.exports = router