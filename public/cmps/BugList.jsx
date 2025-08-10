const { Link } = ReactRouterDOM

import { authService } from '../services/auth.service.local.js'
import { BugPreview } from './BugPreview.jsx'

export function BugList({ bugs, onRemoveBug, onEditBug }) {
    const loggedInUser = authService.getLoggedinUser()

    function canUpdateBug(bug) {
        if (!bug.owner) return true
        if(!loggedInUser) return false
        if(!loggedInUser.isAdmin) return false
        return loggedInUser._id === bug.owner._id
    }

    if (!bugs) return <div>Loading...</div>
    return <ul className="bug-list">
        {bugs.map(bug => (
            <li key={bug._id}>
                <BugPreview bug={bug} />
                <section className="actions">
                    <button><Link to={`/bug/${bug._id}`}>Details</Link></button>
                    {canUpdateBug(bug) &&
                        <div>
                            <button onClick={() => onEditBug(bug)}>Edit</button>
                            <button onClick={() => onRemoveBug(bug._id)}>x</button>
                        </div>
                    }
                </section>
            </li>
        ))}
    </ul >
}
