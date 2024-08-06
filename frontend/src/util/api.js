import axios from "./axios.customize";

const createUserApi = (name, email, password, role) => {
    const URL_API = "v1/api/register"
    const data = {
        name, email, password, role
    }
    return axios.post(URL_API, data)
}

const updateUserApi = (id, data) => {
    const URL_API = `v1/api/user/update/${id}`
    return axios.put(URL_API, data)
}

const updateUserByEmailApi = (email, data, avatar) => {
    const URL_API = `v1/api/user/update_by_email/${email}`
    return axios.put(URL_API, data, avatar)
}


const updatePasswordUser = (old_password, new_password, user_id) => {
    const URL_API = `v1/api/user/change-password`
    return axios.post(URL_API, old_password, new_password, user_id)
}


const deleteUserApi = (id) => {
    const URL_API = `v1/api/user/delete/${id}`
    return axios.delete(URL_API)
}


const loginApi = (email, password) => {
    const URL_API = "v1/api/login"
    const data = {
       email, password
    }
    return axios.post(URL_API, data)
}

const getUserApi = () => {
    const URL_API = "v1/api/user"
    return axios.get(URL_API)
}

const getUserSideBar = () => {
    const URL_API = `v1/api/user-chat`;
    return axios.get(URL_API);
};


export { 
    createUserApi,
    updateUserApi,
    deleteUserApi,
    loginApi,
    getUserApi,
    updateUserByEmailApi,
    updatePasswordUser,
    getUserSideBar
} 