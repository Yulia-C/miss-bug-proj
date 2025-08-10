const { useState, useEffect } = React
const { useParams, useNavigate, Link } = ReactRouterDOM

import { userService } from "../services/user.service.local.js"

export function UserDetails() {

    const [user, setUser] = useState(null)
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadUser()
    }, [params.userId])

    function loadUser() {
        userService.getById(params.userId)
            .then(setUser)
            .catch(err => {
                console.log('err:', err)
                navigate('/')
            })
    }

    if (!user) return <div>Loading...</div>

    return <section className="user-details">
        <h1>{user.fullname}</h1>
        <pre>
            <h2>Username: {user.username}</h2>
            <h2>User Id: {user._id}</h2>
        </pre>
        <Link to="/">Back Home</Link>
    </section>
}