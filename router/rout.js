const Router = require('express');
const {body} = require('express-validator');
const materialsController = require('./controllers/materialsController');
const usersController = require('./controllers/usersController');
const tokensController = require('./controllers/tokensController')
const tasksController = require('./controllers/tasksController');
const imgValidation = require('../middlewares/validation')
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/role');
const accessCategoryMiddleware = require('../middlewares/access-category');
const emailService = require('../services/emailService');

const router = new Router();

router.post('/registration', imgValidation, body('email').isEmail(), usersController.registration);
router.post('/login', tokensController.login);
router.delete('/logout', tokensController.logout);
router.get('/refresh', tokensController.refresh);


router.get('/materials', materialsController.getAllMaterials)
router.get('/materials/:id', materialsController.getOneMaterial)
router.post('/materials', materialsController.addMaterial)
router.put('/materials', materialsController.updateMaterial)
router.delete('/materials', materialsController.deleteMaterial)


router.get('/tasks', /*authMiddleware, accessCategoryMiddleware,*/ tasksController.getTasks);
router.get('/tasks/:id', authMiddleware, accessCategoryMiddleware, tasksController.getTask);
router.post('/tasks', authMiddleware, roleMiddleware(['Admin']), tasksController.addTask);
router.put('/tasks', authMiddleware, roleMiddleware(['Admin']), tasksController.updateTask);
router.delete('/tasks', authMiddleware, roleMiddleware(['Admin']), tasksController.deleteTask);

router.get('verify/:verify_link', emailService.verifyEmail)

module.exports = router