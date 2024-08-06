const { createUserService, handleLoginService, getUserService, updateUserService, deleteUserService, updateUserByEmailService, changePasswordService, getUserForSidebarsService } = require("../services/userService")

const createUser = async (req, res) => {
    const { name, email, password, role } = req.body
   
    try {
        const data = await createUserService(name, email, password, role)
     
        return  res.status(201).json({
            status: 'ok',
            message: 'User created successfully',
            data: data,
        })     
    } catch (error) {
        console.log(error);
        return null;
    }
   
}

const getUserForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        const filteredUsers = await getUserForSidebarsService(loggedInUserId);
        return res.status(200).json(filteredUsers);

    } catch (error) {
        console.log(error);
        return null;
    }
}

const getUserList = async (req, res) => {
    const data = await getUserService()

    return res.status(200).json(data)
}

const updateUser = async (req, res) => {
    const id = req.params.id;
    const value = req.body;

    const data = await updateUserService(id, value)
    return res.status(200).json({
        status: 'ok',
        message: 'User updated successfully',
        data: data,
    })
}

const updateUserByEmail = async (req, res) => {
    const email = req.params.email;
    const value  = req.body;

    const data = await updateUserByEmailService(email, value)
    return res.status(200).json({
        status: 'ok',
        message: 'User updated successfully',
        data: data,
    })
}

const deleteUser = async (req, res) => {
    const id = req.params.id;

    const data = await deleteUserService(id)
    return res.status(200).json({
        status: 'ok',
        message: 'User deleted successfully',
        data: null,
    })
}

const handleLogin = async (req, res) => {
    const { email, password } = req.body
    const data = await handleLoginService(email, password)
    
    return res.status(200).json(data)
}


const getAccount = async (req, res) => {
    return res.status(200).json(req.user)
}

const changePassword = async (req, res) => {
    try {
      const { old_password, new_password, user_id } = req.body;
      const data = await changePasswordService(old_password, new_password, user_id);
  
      return res.status(200).json({
        status: 'ok',
        message: 'Password updated successfully',
        data: data
      });
    } catch (error) {
      return res.status(400).json({
        status: 'error',
        message: error.message || 'Password update failed',
      });
    }
};

module.exports = {
    createUser,
    handleLogin,
    getUserList,
    getAccount,
    updateUser,
    deleteUser,
    updateUserByEmail,
    changePassword,
    getUserForSidebar
}