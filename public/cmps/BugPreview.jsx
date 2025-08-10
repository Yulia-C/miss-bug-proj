const { Link } = ReactRouterDOM
export function BugPreview({ bug }) {
    return <article className="bug-preview">
        <p className="title">Bug Name: {bug.title}</p>
        <p>Severity: <span>{bug.severity}</span></p>
        {bug.owner &&
            <Link to={`/user/${bug.owner._id}`}>
                <p className="owner">Owner: {bug.owner.fullname}</p>
            </Link>
        }
    </article>
}