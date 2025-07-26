import { makeId, readJsonFile, writeJsonFile } from "./util.service.js"
import { loggerService } from "./logger.service.js"

export const bugService = {
    query,
    getById,
    remove,
    save,


}
const bugs = readJsonFile('./data/bug.json')

function query() {
    return Promise.resolve(bugs)
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)

    if (!bug) {
        loggerService.error(`Couldn\'t get bug: ${bugId} in bug service`)
        return Promise.reject(`Couldn't get bug`)
    }
    return Promise.resolve(bug)
}

function remove(bugId) {
    const idx = bugs.findIndex(bug => bug._id === bugId)

    if (idx === -1) {
        loggerService.error(`Couldn\'t remove bug: ${bugId} in bug service`)
        return Promise.reject(`Couldn't remove bug`)
    }

    bugs.splice(idx, 1)
    return _saveBugs()
}

function save(bugToSave) {

    if (bugToSave._id) {
        const idx = bugs.findIndex(bug => bug._id === bugToSave._id)
        if (idx === -1) {
            loggerService.error(`Couldn\'t update bug: ${bugToSave._id} in bug service`)
            return Promise.reject(`Couldn't update bug`)
        }
        bugs.splice(idx, 1, bugToSave)
    } else {
        bugToSave._id = makeId()
        bugs.push(bugToSave)
    }
    return _saveBugs()
        .then(() => bugToSave)
}

function _saveBugs() {
    return writeJsonFile('./data/bug.json', bugs)
}