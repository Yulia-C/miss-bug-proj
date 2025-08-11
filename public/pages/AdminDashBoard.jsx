const { useState, useEffect } = React
const { useNavigate } = ReactRouterDOM

import { UserList } from '../cmps/UserList.jsx'
import { userService } from '../services/user.service.js'
import { authService } from '../services/auth.service.js'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'

export function AdminDashBoard() {
    const user = authService.getLoggedinUser()

    const [users, setUsers] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        loadUsers()
    }, [])

    function loadUsers() {
        if (!user || !user.isAdmin) {
            showErrorMsg('Not Authorized')
            navigate('/')
        }
        userService.query()
            .then(setUsers)
            .catch(err => console.log('err:', err))
    }

    function onRemoveUser(userId) {
        userService.remove(userId)
            .then(() => {
                setUsers(users => users.filter(user => user._id !== userId))
                showSuccessMsg('Removed successfully')
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg(`Couldn't remove user ${user._id} `)
            })
    }

    if (!users) return <div>loading...</div>

    return (
        <section className="users main-content">
            <h1>Hello {user.fullname}</h1>

            <h3>Users Dashboard</h3>
            <UserList users={users} onRemoveUser={onRemoveUser} />
        </section>
    )
}