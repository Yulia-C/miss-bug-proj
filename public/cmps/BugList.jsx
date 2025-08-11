const { Link } = ReactRouterDOM
const { Fragment } = React
import { authService } from '../services/auth.service.js'
import { BugPreview } from './BugPreview.jsx'

export function BugList({ bugs, onRemoveBug, onEditBug }) {
    let loggedInUser = authService.getLoggedinUser()

    function canUpdateBug(bug) {
        if (!bug.owner) return true
        if (!loggedInUser) return false
        if (loggedInUser.isAdmin) return true
        return bug.owner._id === loggedInUser._id
    }

    if (!bugs) return <div>Loading...</div>
    return <ul className="bug-list">
        {bugs.map(bug => (
            <li key={bug._id}>
                <BugPreview bug={bug} />
                <section className="actions">
                    <button><Link to={`/bug/${bug._id}`}>Details</Link></button>
                    {canUpdateBug(bug) &&
                        <Fragment>
                            <button onClick={() => onEditBug(bug)}>Edit</button>
                            <button onClick={() => onRemoveBug(bug._id)}>x</button>
                        </Fragment>

                    }
                </section>
            </li>
        ))}
    </ul >
}
