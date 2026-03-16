import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/User.js";

passport.use(
new GitHubStrategy({
clientID:process.env.GITHUB_CLIENT_ID,
clientSecret:process.env.GITHUB_CLIENT_SECRET,
callbackURL:"/api/auth/github/callback"
},

async(accessToken,refreshToken,profile,done)=>{

let email=profile.emails[0].value;

let user=await User.findOne({email});

if(!user){
user=await User.create({
name:profile.username,
email,
password:"github",
role:"learner"
});
}

return done(null,user);

})
);