const User = require("../models/User");

exports.CompleteProfile = async (req , res) =>{
    try {
        const user = req.user;
        if(user.profileCompleted){
            return res
              .status(400)
              .json({ message: "Profile already completed" });
        }

        const { driver, business } = req.body;

        if (user.role === "driver") {
         
          user.driver = {
            vehicleNumber: driver?.vehicleNumber || "",
            licenseNumber: driver?.licenseNumber || "",
            phone: driver?.phone || "",
          };
        } else if (user.role === "business") {
          user.business = {
            businessName: business?.businessName || "",
            businessAddress: business?.businessAddress || "",
            contactNumber: business?.contactNumber || "",
          };
        }

        user.profileCompleted = true;
        await user.save();

         res.json({
           message: "Profile completed",
           profileCompleted: user.profileCompleted,
           role: user.role,
         });

    } catch (error) {
        res.status(500).json({ message: "Could not complete profile" });
    }
}