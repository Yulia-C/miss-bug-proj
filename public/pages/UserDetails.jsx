const { useState, useEffect } = React
const { useParams, useNavigate, Link } = ReactRouterDOM

import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service.js"
import { BugList } from "../cmps/BugList.jsx"
import { userService } from "../services/user.service.js"
import { bugService } from "../services/bug.service.js"

export function UserDetails({ onRemoveBug, onEditBug }) {

    const [user, setUser] = useState(null)
    const [userBugs, setUserBugs] = useState([])

    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadUser()
        loadUserBugs()
    }, [params.userId])

    function loadUser() {
        userService.getById(params.userId)
            .then(setUser)
            .catch(err => {
                console.log('err:', err)
                navigate('/')
            })
    }

    function loadUserBugs() {
        bugService.query({ userId: params.userId })
            .then(bugs => {
                setUserBugs(bugs)
                console.log('bugs:', bugs)
            })
            .catch(err => console.log('err:', err))
    }

    function onRemoveBug(bugId) {
        bugService
            .remove(bugId)
            .then(() => {
                console.log('Deleted Succesfully!')
                setUserBugs(prevBugs => prevBugs.filter(bug => bug._id !== bugId))
                showSuccessMsg('Bug removed')
            })
            .catch(err => {
                console.log('from remove bug', err)
                showErrorMsg('Cannot remove bug')
            })
    }

    function onEditBug(bug) {
        const severity = +prompt('New severity?')
        if (!severity) return alert('Please enter a severity')
        const bugToSave = { ...bug, severity }
        bugService.save(bugToSave)
            .then(savedBug => {
                console.log('Updated Bug:', savedBug)
                setUserBugs(prevBugs =>
                    prevBugs.map(currBug =>
                        currBug._id === savedBug._id ? savedBug : currBug
                    )
                )
                showSuccessMsg('Bug updated')
            })
            .catch(err => {
                console.log('from edit bug', err)
                showErrorMsg('Cannot update bug')
            })
    }

    if (!user) return <div>Loading...</div>

    return <section className="user-details">
        <h1>{user.fullname}</h1>
        <pre>
            <h2>Username: {user.username}</h2>
            <h2>User Id: {user._id}</h2>
        </pre>
        <section>
            <h2>{user.fullname}'s bugs:</h2>
            <BugList
                bugs={userBugs}
                onRemoveBug={onRemoveBug}
                onEditBug={onEditBug} />
        </section>
        <Link to="/bug">Back</Link>
    </section>
}