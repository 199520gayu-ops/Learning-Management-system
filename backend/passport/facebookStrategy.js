import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import User from "../models/User.js";

passport.use(
new FacebookStrategy({
clientID:process.env.FACEBOOK_APP_ID,
clientSecret:process.env.FACEBOOK_APP_SECRET,
callbackURL:"/api/auth/facebook/callback",
profileFields:["id","displayName","emails"]
},

async(accessToken,refreshToken,profile,done)=>{

let email=profile.emails[0].value;

let user=await User.findOne({email});

if(!user){
user=await User.create({
name:profile.displayName,
email,
password:"facebook",
role:"learner"
});
}

return done(null,user);

})
);