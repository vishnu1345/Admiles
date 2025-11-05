const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req , res , next) =>{
    try {
        const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ' , '');
        if(!token){
            return res.status(401).json({
                message : 'Not Authenticated'
            })
        }

        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-__v');
        if(!user) return res.status(401).json({message : 'User not found'});

        req.user = user;
        next();

    } catch (error) {
         console.error(error);
         res.status(401).json({ message: "Authentication failed" });
    }
}

exports.authorizeRole = (role) => (req , res , next) =>{
    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });
    if (req.user.role !== role)
      return res.status(403).json({ message: "Forbidden for this role" });
    next();
}

