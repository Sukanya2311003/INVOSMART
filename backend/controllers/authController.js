const jwt= require("jsonwebtoken");
const User= require("../models/User");

// HELPER: GENERATE JWT
const generateToken=(id)=>{
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};
// @desc Register new user
// @route POST /api/auth/register
// @access public
exports.registerUser= async(req, res)=>{
    const{ name, email, password}= req.body;

    try{
       if(!name || !email || !password){
        return res.status(400).json({message: "Please fill all fields"});
       }
       //CHECK IF USER EXISTS
       const userExists = await User.findOne({email});
       if(userExists){
        return res.status(400).json({message: "User already Exists"})
       }

    //    CREATE user 
    const user= await User.create({name, email, password});
    if(user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken (user._id),
        });
    }
    else{
        res.status(400).json({message: "Invalid user credentials"});

    }
    }
    catch(error){
        res.status(500).json({message: "server Error"});
    }
};
// @desc login new user
// @route POST /api/auth/login
// @access public
// exports.loginUser = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     console.log("Login attempt with:", email, password);

//     const user = await User.findOne({ email }).select("+password");
//     console.log("User found:", user ? user.email : "No user");

//     if (user) {
//       console.log("Stored hash:", user.password);
//       const isMatch = await user.matchPassword(password);
//       console.log("Password match:", isMatch);
//     }

//     if (user && (await user.matchPassword(password))) {
//       res.json({
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         token: generateToken(user._id),
//         businessName: user.businessName || "",
//         address: user.address || "",
//         phone: user.phone || "",
//       });
//     } else {
//       res.status(401).json({ message: "Invalid credentials" });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "server Error" });
//   }
// };

//@desc Get current logged in user
//@route GET/Api/ auth/me
//@access Private

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Login attempt with:", email, password);

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      console.log("No user found");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("User found:", user.email);
    console.log("Stored hash:", user.password);

    const isMatch = await user.matchPassword(password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ Successful login
    const token = generateToken(user._id);
    console.log("Generated token:", token);

    return res.status(200).json({
      message: "Login successful",
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
      businessName: user.businessName || "",
      address: user.address || "",
      phone: user.phone || "",
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};



exports.getMe= async( req, res)=>{
    try {
         const user= await User.findById(req.user.id);
         res.json({
            _id: user._id,
            name:user.name,
            email:user.email,

            businessName:user.businessName || "",
            address: user.phone || "",
         });


    } catch (error) {
      res.status(500).json({ message: "server Error" });
    }
}
//@desc update user profile
//@route pPUT/Api/ auth/me
//@access Private
exports.updateUserProfile= async(req, res)=>{
    try {
      const user= await User.findById(req.user.id);
      if(user){
        user.name= req.body.name || user.name;
        user.businessName= req.body.businessName || user.businessName;
        user.address= req.body.address || user.address;
        user.phone= req.body.phone || user.phone;
        const updatedUser= await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            businessName: updatedUser.businessName,
            address: updatedUser.address,
            phone: updatedUser.phone,


        });

      } else{
        res.status(404).json({message: "User not found"});
      }

    } catch (error) {
      res.status(500).json({ message: "server Error" });
    }
};
