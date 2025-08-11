import { UserPreview } from "./UserPreview.jsx"

export function UserList({ users, onRemoveUser }) {
    return (
        <ul  className="user-list">
            {users.map(user =>
                <UserPreview  key={user._id} user={user} onRemoveUser={onRemoveUser} />
            )}
        </ul>
    )
}