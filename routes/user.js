var express = require('express');
const { body } = require('express-validator');
var router = express.Router();
const userController = require('../controllers/userController')
const passportJWT = require('../middleware/passportJWT')

router.get('/',[passportJWT.isLogin],userController.index);


router.post('/login',userController.login);

/* GET users listing. */
router.post('/register',[
  body('name').not().isEmpty().withMessage('กรุณาป้อนข้อมูลชื่อสกุลด้วย'),
  body('email').not().isEmpty().withMessage('กรุณากรอกอีเมลด้วย').isEmail().withMessage('รูปเเบบอีเมล์ไม่ถูกต้อง'),
  body('password').not().isEmpty().withMessage('กรุณากรอกรหัสผ่านด้วย').isLength({ min:3 }).withMessage('รหัสผ่านต้อง 3 ตัวอักษรขึ้นไป')
],userController.register);

router.get('/me',[ passportJWT.isLogin ], userController.me);



module.exports = router;
