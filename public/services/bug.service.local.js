import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'
import { authService } from './auth.service.local.js'
const STORAGE_KEY = 'bugs'

_createBugs()

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
    getTotalBugs
}

function query(filterBy) {
    return storageService.query(STORAGE_KEY)
        .then(bugs => {

            if (filterBy.txt) {
                const regExp = new RegExp(filterBy.txt, 'i')
                bugs = bugs.filter(bug => regExp.test(bug.title))
            }

            if (filterBy.minSeverity) {
                bugs = bugs.filter(bug => bug.severity >= filterBy.minSeverity)
            }

            return bugs
        })
}

function getById(bugId) {
    return storageService.get(STORAGE_KEY, bugId)
}

function remove(bugId) {
    return storageService.remove(STORAGE_KEY, bugId)
}

function save(bug) {
    if (bug._id) {
        return storageService.put(STORAGE_KEY, bug)
    } else {
        bug.owner = authService.getLoggedinUser()
        return storageService.post(STORAGE_KEY, bug)
    }
}

function _createBugs() {
    let bugs = utilService.loadFromStorage(STORAGE_KEY)
    if (!bugs && !bugs.length) return

    bugs = [
        {
            title: "Infinite Loop Detected",
            severity: 4,
            _id: "1NF1N1T3",
            createdAt: 1542107359454,
            labels: [
                "critical",
                "need-CR",
                "dev-branch"
            ],
            owner: authService.getLoggedinUser()
        },
        {
            title: "Keyboard Not Found",
            severity: 3,
            _id: "K3YB0RD",
            createdAt: 1542107359454,
            labels: [
                "critical",
                "need-CR",
                "dev-branch"
            ],
            owner: authService.getLoggedinUser()
        },
        {
            title: "404 Coffee Not Found",
            severity: 2,
            _id: "C0FF33",
            createdAt: 1542107359454,
            labels: [
                "critical",
                "need-CR",
                "dev-branch"
            ],
            owner: authService.getLoggedinUser()
        },
        {
            title: "Unexpected Response",
            severity: 1,
            _id: "G0053",
            createdAt: 1542107359454,
            labels: [
                "critical",
                "need-CR",
                "dev-branch"
            ],
            owner: authService.getLoggedinUser()
        }
    ]
    utilService.saveToStorage(STORAGE_KEY, bugs)
}

function getDefaultFilter() {
    return { txt: '', minSeverity: 0, sortBy: '', sortDir: 1, pageIdx: 0 }
}

function getTotalBugs() {
    let bugs = _createBugs()
    return bugs
}