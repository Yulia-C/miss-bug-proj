import { makeId, readJsonFile, writeJsonFile } from "./util.service.js"
import { loggerService } from "./logger.service.js"

const users = readJsonFile('data/user.json')

export const userService = {
    query,
    getById,
    getByUsername,
    remove,
    add,
}

function query() {
    const usersToReturn = users.map(user => ({ _id: user._id, fullname: user.fullname, username: user.username }))
    return Promise.resolve(usersToReturn)
}

function getById(userId) {
    let user = users.find(user => userId === user._id)
    if (!user) {
        loggerService.error(`Couldn't get user: ${userId} in user service`)
        return Promise.reject('User not found')
    }
    user = { ...user }
    delete user.password
    return Promise.resolve(user)
}

function getByUsername(username) {
    const user = users.find(user => user.username === username)
    return Promise.resolve(user)
}

function remove(userId) {
  const idx = users.findIndex(user => user._id === userId)
    if (idx === -1) return Promise.reject('sorry not found')
    users.splice(idx, 1)
    return _saveUsers()
}

function add(user) {
    return getByUsername(user.username)
        .then(existingUser => {
            if (existingUser) return Promise.reject('User already exists')

            if (!user.fullname || !user.username || !user.password) {
                return Promise.reject('Incomplete credentials')
            }

            user._id = makeId()
            user.isAdmin = false

            users.push(user)

            return _saveUsers()
                .then(() => {
                    user = { ...user }
                    delete user.password
                    return user
                })
                .catch(err => loggerService.error(err))
        })
}

// function _saveUsersToFile() {
//     return new Promise((resolve, reject) => {
//         const usersStr = JSON.stringify(users, null, 2)
//         fs.writeFile(users, usersStr, err => {
//             if (err) {
//                 loggerService.error(err)
//                 return console.log(err)
//             }
//             resolve()
//         })
//     })
// }
function _saveUsers() {
    // const usersStr = JSON.stringify(users, null, 2)

    return writeJsonFile('./data/user.json', users)
}