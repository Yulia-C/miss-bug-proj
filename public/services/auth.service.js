
const STORAGE_KEY_LOGGED_USER = 'loggedInUser'
const BASE_URL = '/api/auth/'

export const authService = {
    login,
    signup,
    logout,
    getLoggedinUser,
}


function login({ username, password }) {
    return axios.post(BASE_URL + 'login', { username, password })
        .then(res => res.data)
        .then(_setLoggedInUser)
        .catch(err => console.log('err:', err))
}

function signup({ username, password, fullname }) {
    return axios.post(BASE_URL + 'signup', { username, password, fullname })
        .then(res => res.data)
        .then(_setLoggedInUser)
        .catch(err => console.log('err:', err))

}

function logout() {
    return axios.post(BASE_URL + 'logout')
        .then(() => sessionStorage.removeItem(STORAGE_KEY_LOGGED_USER))
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGED_USER))
}

function _setLoggedInUser(user) {
    const userToSave = {
        _id: user._id,
        fullname: user.fullname,
        isAdmin: user.isAdmin
    }
    sessionStorage.setItem(STORAGE_KEY_LOGGED_USER, JSON.stringify(userToSave))
    return userToSave
}