const jwt = require('jsonwebtoken');
const User = require("../models/user");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const changePasswordService = async (oldPassword, newPassword, userId) => {
    const user = await User.findById(userId);
    if (!user) {
      return {
        status: "error",
        message: "User is undefined!"
      }
    }

    const matched = await bcrypt.compare(oldPassword, user.password);
    if (!matched) {
      return {
        status: "error",
        message: "Password old is incorect!"
      }
    }

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const result = await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    );

    return result;
};
const createUserService = async (name, email, password, role) => {
    try {
        // check email exists
        const user = await User.findOne({ email: email });
        if (user) {
            return {
                status: "error",
                message: "Email đã tồn tại!"
            }
        } else {
          // Hash password
          const hashPassword = await bcrypt.hash(password, saltRounds);
          // Save User to database
          let result = await User.create({
              name: name,
              email: email,
              password: hashPassword,
              role: role ,
              avatar: "https://inkythuatso.com/uploads/thumbnails/800/2023/03/6-anh-dai-dien-trang-inkythuatso-03-15-26-36.jpg",
          })
          return result;
        }
    
    } catch (error) {
        console.log(error);
        return null;
    }
}

const getUserForSidebarsService = async (loggedInUserId) => {
  try {
    let result =   await User.find({ _id: { $ne: loggedInUserId } }).select("-password")
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
}

const getUserService = async () => {
  try {
    let result = await User.find({});
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
}

const updateUserService = async (id, data) => {
  try {
    let result = await User.findOneAndUpdate(
      { _id: id },
      data,
      { new: true }
    );
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
}

const updateUserByEmailService = async (email, data) => {
  try {
    let result = await User.findOneAndUpdate(
      { email: email },
      data,
      { new: true }
    );
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
}

const deleteUserService = async (id) => {
  try {
    let result = await User.findByIdAndDelete(id);
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
}


const handleLoginService = async (email, password) => {
  try {
      // Find user by email
      const user = await User.findOne({ email: email });
      
      if (user) {
          // Compare password
          const isMatchPassword = await bcrypt.compare(password, user.password);
          
          if (!isMatchPassword) {
              return {
                  status: "error",
                  message: "Email/Password không hợp lệ!"
              };
          } else {
              // Create an access token
              const payload = {
                  _id: user._id,
                  email: user.email,
                  role: user.role,
                  name: user.name,
                  avatar: user.avatar // Removed password from payload
              };
              
              const access_token = jwt.sign(
                  payload,
                  process.env.JWT_SECRET,
                  {
                      expiresIn: process.env.JWT_EXPIRE || '1h', // Default expire time if not set
                  }
              );

              return {
                  status: "ok",
                  access_token,
                  user: {
                      _id: user._id,
                      email: user.email,
                      name: user.name,
                      role: user.role,
                  }
              };
          }
      } else {
          return {
              status: "error",
              message: "Email/Password không hợp lệ!"
          };
      }
  } catch (error) {
      return {
          status: "error",
          message: "An error occurred while processing your request."
      };
  }
};


module.exports = {
    createUserService,
    handleLoginService,
    getUserService,
    updateUserService,
    deleteUserService,
    updateUserByEmailService,
    changePasswordService,
    getUserForSidebarsService
}