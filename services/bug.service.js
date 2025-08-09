import { makeId, readJsonFile, writeJsonFile } from "./util.service.js"
import { loggerService } from "./logger.service.js"

export const bugService = {
    query,
    getById,
    remove,
    save,
    getEmptyBug,
    getTotalCount
}

const bugs = readJsonFile('./data/bug.json')

const PAGE_SIZE = 2
let totalPages = null

function query(filter, sort, page) {

    let bugsToDisplay = bugs

    if (filter.minSeverity) {
        bugsToDisplay = bugsToDisplay.filter(bug => bug.severity >= filter.minSeverity)
    }

    if (filter.txt) {
        const regExp = new RegExp(filter.txt, 'i')
        bugsToDisplay = bugsToDisplay.filter(bug =>
            regExp.test(bug.title)
            || bug.labels.some(label => regExp.test(label))
            || regExp.test(bug.description))
    }

    if (sort.sortBy) {
        ['severity', 'createdAt'].includes(sort.sortBy)
            ? bugsToDisplay.sort((a, b) =>
                (a[sort.sortBy] - b[sort.sortBy]) * sort.sortDir)
            : bugsToDisplay.sort((a, b) =>
                a[sort.sortBy].localeCompare(b[sort.sortby]) * sort.sortDir)
    }

    totalPages = Math.ceil(bugsToDisplay.length / PAGE_SIZE)

    let pageIdx = page.pageIdx

    const startIdx = page.pageIdx * PAGE_SIZE // 0, 3, 6
    const endIdx = startIdx + PAGE_SIZE

    if (pageIdx < 0) totalPages - 1
    if (pageIdx >= totalPages) pageIdx = 0

    bugsToDisplay = bugsToDisplay.slice(startIdx, endIdx)

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
    // console.log('bugId:', bugId)
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

function getTotalCount() {
    return Promise.resolve(totalPages)
}

function getEmptyBug() {
    return {
        title: title || '',
        severity: severity || '',
        description: description || '',
        createdAt: Date.now(),
        labels: [],
    }
}