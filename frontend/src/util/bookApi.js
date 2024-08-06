import axios from "./axios.customize";

const createBookApi = (data) => {
    const URL_API = "v1/api/book/create"
    return axios.post(URL_API, data)
}

const updateBookApi = (id, data) => {
    const URL_API = `v1/api/book/update/${id}`
    return axios.put(URL_API, data)
}

const deleteBookApi = (id) => {
    const URL_API = `v1/api/book/delete/${id}`
    return axios.delete(URL_API)
}

const getBookApi = (limit, page, searchKey) => {
    const URL_API = `v1/api/book/list?limit=${limit}&page=${page}&searchKey=${encodeURIComponent(searchKey)}`;
    return axios.get(URL_API);
};

export { 
    createBookApi,
    updateBookApi,
    deleteBookApi,
    getBookApi
} 