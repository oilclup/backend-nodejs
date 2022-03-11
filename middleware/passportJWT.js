const User = require('../models/user')
const passport = require('passport')

// มาดึง JWT ออกจาก payload
const JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt;
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'Y2gV7gLwHxGOJuvc3G2kd1gerBPpUDjrI5D6hipVH8N8exev0nI0NGUrNUxTWMH';

passport.use(new JwtStrategy(opts, async(jwt_payload, done) => {
    console.log(jwt_payload);
  try {
      const user = await User.findById(jwt_payload.id);
      if(!user){
          return done(new Error('ไม่พบผู้ใช้ในระบบ'), null)
      }

      return done(null, user);

  } catch (error) {
    done(error)
  }
}));

module.exports.isLogin = passport.authenticate('jwt', { session: false });