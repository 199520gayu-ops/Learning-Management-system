import passport from "passport";
import { Strategy as LinkedInStrategy } from "passport-linkedin-oauth2";
import User from "../models/User.js";

passport.use(
new LinkedInStrategy({
clientID:process.env.LINKEDIN_CLIENT_ID,
clientSecret:process.env.LINKEDIN_CLIENT_SECRET,
callbackURL:"/api/auth/linkedin/callback",
scope:["r_emailaddress","r_liteprofile"]
},

async(accessToken,refreshToken,profile,done)=>{

let email=profile.emails[0].value;

let user=await User.findOne({email});

if(!user){
user=await User.create({
name:profile.displayName,
email,
password:"linkedin",
role:"learner"
});
}

return done(null,user);

})
);