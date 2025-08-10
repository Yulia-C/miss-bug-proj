import Cryptr from "cryptr"
import { userService } from "./user.service.js"

const cryptr = new Cryptr(process.env.SECRET || 'Some-secret-auth')

export const authService = {
    checkLogin,
    getLoginToken,
    validateToken
}

// const encrypted = cryptr.encrypt('boo')
// const decrypted = cryptr.decrypt(encrypted)
// console.log('decrypted:', decrypted)

function checkLogin({ username, password }) {
    return userService.getByUsername(username)
        .then(user => {
            if (user && user.password === password) {
                user = { ...user }
                delete user.password
                return Promise.resolve(user)
            }
            return Promise.reject('One or more details are incorrect')
        })

}

function getLoginToken(user) {
    const str = JSON.stringify(user)
    const encryptedStr = cryptr.encrypt(str)
    return encryptedStr
}


function validateToken(token) {
    if (!token) return null
    const str = cryptr.decrypt(token)
    const user = JSON.parse(str)
    return user
}