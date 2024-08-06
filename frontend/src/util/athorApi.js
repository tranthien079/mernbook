import axios from "./axios.customize";

const createAuthorApi = (data) => {
    const URL_API = "v1/api/author/create"
    return axios.post(URL_API, data)
}

const updateAuthorApi = (id, data) => {
    const URL_API = `v1/api/author/update/${id}`
    return axios.put(URL_API, data)
}

const deleteAuthorApi = (id) => {
    const URL_API = `v1/api/author/delete/${id}`
    return axios.delete(URL_API)
}

const getAuthorApi = () => {
    const URL_API = "v1/api/author/list"
    return axios.get(URL_API)
}

export { 
    createAuthorApi,
    updateAuthorApi,
    deleteAuthorApi,
    getAuthorApi
} 