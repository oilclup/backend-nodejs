const User = require('../models/user')
const {validationResult} = require('express-validator')
const jwt = require('jsonwebtoken');


exports.index = (req, res, next) => {
  res.status(200).json({
    data:[
      {id: 1, name: 'John'},
      {id: 2, name: 'Mary'}
    ]
  })
}


exports.register = async(req,res,next) => {
  try{
      const { name, email, password } = req.body;
      // ตรวจสอบข้อมูล
      const errors = validationResult(req)
      if(!errors.isEmpty()){
          const error = new Error('ข้อมูลที่รับมาไม่ถูกต้อง')
          error.statusCode = 422;
          error.validation = errors.array();
          throw error;
      }
       // เช็ค email ซ้ำ
      const existEmail = await User.findOne({ email:email });
      console.log('อีเมลนี้ซ้ำ' + existEmail);
      if(existEmail) {
        const error = new Error('อีเมล์ซ้ำ มีผู้ใช้งานเเล้ว ลองใหม่อีกครั้ง')
        error.statusCode = 400;
        throw error;
      }
      let user = new User();
      user.name = name;
      user.email = email;
      user.password = await user.encryptPassword(password);

      await user.save();
      res.status(201).json({
          message: 'ลงทะเบียนเรียบร้อย'
      })
  } catch(error) {
      next(error)
  }
}

exports.login = async(req, res, next) => {
   try {
   
    const { email,password } = req.body;
    
    const user = await User.findOne({ email:email });
    console.log("Login => " + user);
    if(!user) {
      const error = new Error('ไม่พบผู้ใช้งานในระบบ')
      error.statusCode = 404;
      throw error;
    }

    const isValid = await user.checkPassword(password);
    console.log(isValid);
    if(!isValid) {
      const error = new Error('รหัสผ่านไม่ถูกต้อง');
      error.statusCode = 401;
      throw error;
    }
    
    const JWT_SECRET = 'Y2gV7gLwHxGOJuvc3G2kd1gerBPpUDjrI5D6hipVH8N8exev0nI0NGUrNUxTWMH'
    const token = await jwt.sign({
      id : user._id,
      role: user.role
    }, JWT_SECRET,{expiresIn: '5 days'});

    const expires_in = jwt.decode(token)
    
    res.status(200).json({
      access_token: token,
      expires_in: expires_in.exp,
      token_type: 'Bearer'
    })

  } catch(error) {
    next(error)
  } 
}

// get profile
exports.me = (req, res, next) => {
  const {_id,name,email,role} = req.user
  return res.status(200).json({
    user: {
      id: _id,
      name: name,
      email: email,
      role: role
    }
  })
}