const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");
require("dotenv").config();

const prisma = new PrismaClient();

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    const user = await getUserFromDatabase(jwtPayload.id);
    console.log("user is ");
    console.log(user);
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://98ywwr-3000.csb.app/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find the user in the database based on the email
        // console.log(profile);
        const user = await prisma.user.findUnique({
          where: { email: profile.emails[0].value },
        });

        if (user) {
          // User already exists, generate a JWT token
          const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

          // Call done() with the existing user and the token
          done(null, { user, token });
        } else {
          // User doesn't exist, create a new user in the database
          const newUser = await prisma.user.create({
            data: {
              fullName: profile.displayName,
              email: profile.emails[0].value,
              provider: "GOOGLE",
              imgUri: profile.photos[0].value,
              // Add any other relevant user information from the profile object
            },
          });

          // Generate a JWT token for the new user
          const token = jwt.sign(
            { userId: newUser.id },
            process.env.JWT_SECRET
          );

          // Call done() with the new user and the token
          done(null, { user: newUser, token });
        }
      } catch (error) {
        // Handle any errors that occurred during user retrieval or creation
        done(error, null);
      }
    }
  )
);

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        // Find the user in the database based on the email
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          return done(null, false, { message: "Invalid email or password" });
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Invalid email or password" });
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

async function getUserFromDatabase(userId) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
      },
    });

    return user;
  } catch (error) {
    // console.error(error);
    // throw new Error('Error retrieving user from the database');
    return null;
  }
}

module.exports = passport;
