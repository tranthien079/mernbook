import axios from "./axios.customize";

const getMessages = (id) => {
    const URL_API = `v1/api/message/${id}`
    return axios.get(URL_API, id)
}

const sendMessageTo = (id, message) => {
    const URL_API = `v1/api/message/send/${id}`
    return axios.post(URL_API, message)
}


export { 
    getMessages,
    sendMessageTo,
} 