const { useState, useEffect } = React
const { Link, useParams } = ReactRouterDOM

import { bugService } from '../services/bug.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'

export function BugDetails() {

    const [bug, setBug] = useState(null)
    const { bugId } = useParams()

    useEffect(() => {
        bugService.getById(bugId)
            .then(bug => setBug(bug))
            .catch(err => showErrorMsg(`Cannot load bug`, err))
    }, [])

    return <div className="bug-details main-content">
        <h3>Bug Details:</h3>
        {!bug && <p className="loading">Loading....</p>}
        {
            bug &&
            <div>
                <h4> {bug.title}</h4>
                <img className="bug-img" src={`https://api.dicebear.com/8.x/bottts/svg?seed=${bug.title}`} />
                <h5>Severity: <span>{bug.severity}</span></h5>
                <p>Description: {bug.description}</p>
            </div>
        }
        <hr />
        <Link to="/bug">Back to List</Link>
    </div>

}