const { Link } = ReactRouterDOM
export function UserPreview({ user, onRemoveUser }) {
    return (
        <li className="user-preview card flex column space-between">
            <Link to={`/user/${user._id}`}>
                <h4>Username: {user.username}</h4>
            </Link>
            <h4>Full Name: {user.fullname}</h4>
            <h4>ID: {user._id}</h4>
            <button className="btn" onClick={() => onRemoveUser(user._id)}>
                Remove this user
            </button>
        </li>
    )
}