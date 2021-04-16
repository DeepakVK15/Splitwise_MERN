"use strict";
var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
var { secret } = require("./config");
const Users = require('./models/UserModel');

// Setup work and export for the JWT passport strategy
function auth() {
    var opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: secret
    };
    passport.use(
        new JwtStrategy(opts, (jwt_payload, done) => {
            const user_id = jwt_payload._id;
            Users.findOne({_id:user_id}, (err, results) => {
                if (results) {
                   return done(null, results);
                }
                return done(null, false);
            });
        })
    )
}

function checkAuth(){
    passport.authenticate('jwt', { session: false });
}

exports.checkAuth = checkAuth;
exports.auth = auth;

