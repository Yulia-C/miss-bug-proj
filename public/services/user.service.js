
export const userService = {
    query,
    getById,
    getEmptyCredentials,
}

const BASE_URL = '/api/user/'

function query() {
    return axios.get(BASE_URL)
        .then(res => res.data)
}

function getById(userId) {
    return axios.get(BASE_URL + userId)
}

function getEmptyCredentials() {
    return {
        username: '',
        password: '',
        fullname: ''
    }
}
