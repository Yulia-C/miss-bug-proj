import { authService } from "../services/auth.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"

const { NavLink, Link } = ReactRouterDOM
const { useNavigate } = ReactRouter

export function AppHeader({ loggedInUser, setLoggedInUser }) {
    const navigate = useNavigate()

    function onLogout() {
        authService.logout()
            .then(() => {
                setLoggedInUser(null)
                showSuccessMsg('You have logged out')
                navigate('/auth')
            })
            .catch((err) => {
                console.log(err)
                showErrorMsg(`Couldn't logout`)
            })
    }
    // console.log('loggedInUser:', loggedInUser.isAdmin)
    // if (loggedInUser) return <div>loading...</div>
    return (

        <header className="app-header main-content single-row">
            <h1>Miss Bug</h1>
            <nav>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/bug">Bugs</NavLink>
                <NavLink to="/about">About</NavLink>

                {loggedInUser && loggedInUser.isAdmin &&
                    <NavLink to="/admin">Admin</NavLink>
                }
                {!loggedInUser ?
                    <NavLink to="/auth">Login</NavLink> :
                    <div className="user">
                        <Link to={`/user/${loggedInUser._id}`}>{loggedInUser.fullname}</Link>
                        <button className="logout" onClick={onLogout}>Logout</button>
                    </div>}
            </nav>
            {/* <UserMsg /> */}
        </header>)
}