const { useState, useEffect } = React

import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

import { BugFilter } from '../cmps/BugFilter.jsx'
import { BugList } from '../cmps/BugList.jsx'

export function BugIndex() {
    const [bugs, setBugs] = useState(null)
    const [totalCount, setTotalCount] = useState(null)
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())

    useEffect(() => {
        getTotalCount()
        loadBugs()
    }, [filterBy])

    function loadBugs() {
        bugService.query(filterBy)
            .then(setBugs)
            .catch(err => showErrorMsg(`Couldn't load bugs - ${err}`))
    }


    // function getTotalCount() {
    //     bugService.getTotalBugs()
    //         .then(count => {
    //             setTotalCount(count)
    //         })
    //         .catch(err => showErrorMsg(`Couldn't get total count - ${err}`))
    // }
    function getTotalCount() {
        bugService.getTotalBugs().then((count) => {
            const buttons = []
            buttons.length = count
            buttons.fill({ disabled: false }, 0, count)
            setTotalCount(buttons)
        }).catch(err => showErrorMsg(`Couldn't get total count - ${err}`))

    }

    function onRemoveBug(bugId) {
        bugService.remove(bugId)
            .then(() => {
                const bugsToUpdate = bugs.filter(bug => bug._id !== bugId)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch((err) => showErrorMsg(`Cannot remove bug`, err))
    }

    function onAddBug() {
        const bug = {
            title: prompt('Bug title?', ''),
            severity: +prompt('Bug severity?', 3),
            description: prompt('Describe the bug:', ''),
            createdAt: Date.now(),
        }

        bugService.save(bug)
            .then(savedBug => {
                setBugs([...bugs, savedBug])
                showSuccessMsg('Bug added')
            })
            .catch(err => showErrorMsg(`Cannot add bug`, err))
    }

    function onEditBug(bug) {
        const severity = +prompt('New severity?', bug.severity)
        const description = prompt('New description?', bug.description)
        const bugToSave = { ...bug, severity, description }

        bugService.save(bugToSave)
            .then(savedBug => {
                const bugsToUpdate = bugs.map(currBug =>
                    currBug._id === savedBug._id ? savedBug : currBug)

                setBugs(bugsToUpdate)
                showSuccessMsg('Bug updated')
            })
            .catch(err => showErrorMsg('Cannot update bug', err))
    }

    function onSetFilterBy(filterBy) {
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
    }


    const totalPages = getTotalCount()
    function onChangePage(idx) {

        setFilterBy(prevFilter => {
            return { ...prevFilter, pageIdx: idx }
        })

        // setFilterBy(prev => {
        //     const nextPageIdx = prev.pageIdx + diff
        //     if (nextPageIdx < 0 || nextPageIdx >= totalPages - 1) {
        //         return prev
        //     }

        //     return {
        //         ...prev,
        //         pageIdx: nextPageIdx
        //     }
        // })
    }

    if (!bugs) return <div>Loading...</div>

    return <section className="bug-index main-content">

        <BugFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
        <header>
            <h3>Bug List</h3>
            <button onClick={onAddBug}>Add Bug</button>
        </header>

        {totalCount && <section className="pagination">
            {totalCount.map((btn, idx) => (
                <button onClick={() => onChangePage(idx)}
                    key={idx} className={`page-btn ${btn.disabled ? 'disabled' : ''}`}>
                    {idx + 1}
                </button>
            ))}
            {/* <button onClick={() => onChangePage(idx - 1)}>-</button>
            <span>{filterBy.pageIdx + 1}</span>
            <button onClick={() => onChangePage(idx + 1)} disabled={filterBy.pageIdx > totalPages + 1}>+</button> */}
        </section>}

        <BugList
            bugs={bugs}
            onRemoveBug={onRemoveBug}
            onEditBug={onEditBug} />
    </section>
}
