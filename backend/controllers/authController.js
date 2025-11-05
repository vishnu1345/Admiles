// const {OAuth2Client} = require('google-auth-library');

// const jwt = require('jsonwebtoken');

// const User = require('../models/User');

// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// const createSendToken = (user , res) =>{
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: process.env.JWT_EXPIRES_IN || "7d",
//     });

//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       maxAge: 1000 * 60 * 60 * 24 * 7,
//     });

//     return token;
// }

// exports.googleAuth = async (req , res) =>{
//     try {
//       const { id_token, desiredRole } = req.body;
//       if (!id_token)
//         return res.status(400).json({ message: "No id_token provided" });

//       const ticket = await client.verifyIdToken({
//         idToken: id_token,
//         audience: process.env.GOOGLE_CLIENT_ID,
//       });
//       const payload = ticket.getPayload();
//       const { sub: googleId, email, name, picture } = payload;

//       let user = await User.findOne({ email });
//       if (!user) {
//         if (!["driver", "business"].includes(desiredRole)) {
//           return res.status(400).json({ message: "invalid role" });
//         }

//         user = await User.create({
//           googleId,
//           email,
//           name,
//           avatar: picture,
//           role: desiredRole,
//           profileCompleted: false,
//         });

//         createSendToken(user, res);
//         return res.status(200).json({
//           message: "User Created",
//           profileCompleted: user.profileCompleted,
//           role: user.role,
//         });
//       }

//       createSendToken(user, res);
//       return res.status(200).json({
//         message: "User logged in",
//         profileCompleted: user.profileCompleted,
//         role: user.role,
//       });
//     } catch (error) {
//       console.error("Google Auth Error:", error);
//       return res
//         .status(500)
//         .json({ message: "Google auth failed", error: error.message });
//     }

// }

// exports.logout = (req, res) => {
//   res.clearCookie("token");
//   res.json({ message: "Logged out" });
// };

// exports.getMe = async (req, res) => {
//   if (!req.user) return res.status(401).json({ message: "Not authenticated" });
//   const user = req.user.toObject();
//   delete user.__v;
//   res.json({ user });
// };

const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const createSendToken = (user, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  return token;
};

exports.googleAuth = async (req, res) => {
  try {
    const { id_token, desiredRole } = req.body;

    if (!id_token)
      return res.status(400).json({ message: "No id_token provided" });

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Check or create user
    let user = await User.findOne({ email });

    if (!user) {
      if (!["driver", "business"].includes(desiredRole)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      user = await User.create({
        googleId,
        email,
        name,
        avatar: picture,
        role: desiredRole,
        profileCompleted: false,
      });

      createSendToken(user, res);
      return res.status(201).json({
        message: "User created",
        profileCompleted: user.profileCompleted,
        role: user.role,
      });
    }

    createSendToken(user, res);
    return res.status(200).json({
      message: "User logged in",
      profileCompleted: user.profileCompleted,
      role: user.role,
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    return res
      .status(500)
      .json({ message: "Google auth failed", error: error.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};

exports.getMe = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  const user = req.user.toObject();
  delete user.__v;
  res.json({ user });
};
