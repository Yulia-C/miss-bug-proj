const { Link } = ReactRouterDOM

export function BugPreview({ bug }) {
    return <article className="bug-preview">
        <p className="title">Bug Name:  <span>{bug.title}</span></p>
        <p>Severity: <span>{bug.severity}</span></p>

        {bug.owner &&
            <h4 className="owner">
                 Owner: 
                 <span><Link to={`/user/${bug.owner._id}`}>
                   {bug.owner.fullname}
                </Link></span>
            </h4>
        }
        <img className="bug-img" src={`https://api.dicebear.com/8.x/bottts/svg?seed=${bug.title}`} />
    </article>
}