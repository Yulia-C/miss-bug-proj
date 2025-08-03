import { makeId, readJsonFile, writeJsonFile } from "./util.service.js"
import { loggerService } from "./logger.service.js"

export const bugService = {
    query,
    getById,
    remove,
    save,


}
const bugs = readJsonFile('./data/bug.json')

function query(filterBy = {}) {
    
    let bugsToDisplay = bugs

    if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        bugsToDisplay = bugsToDisplay.filter(bug => regExp.test(bug.title))
    }

    if (filterBy.minSeverity) {
        bugsToDisplay = bugsToDisplay.filter(bug => bug.severity >= filterBy.minSeverity)
    }

    if (filterBy.pageIdx !== undefined) {
        const startIdx = filterBy.pageIdx * PAGE_SIZE // 0, 3, 6
        bugsToDisplay = bugsToDisplay.slice(startIdx, startIdx + PAGE_SIZE)
    }
 
    return Promise.resolve(bugsToDisplay)
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

        bugs[idx] = { ...bugs[idx], ...bugToSave }
        // bugs.splice(idx, 1, bugToSave)
    } else {
        bugToSave._id = makeId()
        bugToSave.createdAt = Date.now()
        bugs.push(bugToSave)
    }
    return _saveBugs()
        .then(() => bugToSave)
}

function _saveBugs() {
    return writeJsonFile('./data/bug.json', bugs)
}