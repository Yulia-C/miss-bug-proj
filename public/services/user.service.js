
let BASE_URL = '/api/user/'
let ADMIN_URL = '/api/admin/'
export const userService = {
    query,
    getById,
    getEmptyCredentials,
    remove,
}


function query() {
    return axios.get(BASE_URL)
        .then(res => res.data)
}

function getById(userId) {
    return axios.get(BASE_URL + userId)
        .then(res => res.data)
}

// For Admin only
function remove(userId) {
    return axios.delete(ADMIN_URL + userId)
        .then(res => res.data)
}

function getEmptyCredentials() {
    return {
        username: '',
        password: '',
        fullname: ''
    }
}


