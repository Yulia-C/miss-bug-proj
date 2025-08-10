const { useState } = React
const { useNavigate } = ReactRouter

import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { userService } from '../services/user.service.js'
import { authService } from '../services/auth.service.js'

export function LoginSignup({ setLoggedInUser }) {

    const [isSignup, setIsSignUp] = useState(false)
    const [credentials, setCredentials] = useState(userService.getEmptyCredentials())

    const navigate = useNavigate()

    function handleChange({ target }) {
        const { name: field, value } = target
        setCredentials(prev => ({ ...prev, [field]: value }))
    }

    function handleSubmit(ev) {
        ev.preventDefault()
        isSignup ? signup(credentials) : login(credentials)
        navigate('/bug')

    }

    function login(credentials) {
        
        authService.login(credentials)
            .then(user => {
                setLoggedInUser(user)
                showSuccessMsg('Logged in successfully')
                navigate('/bug')

            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg(`Couldn't login`)
            })
    }

    function signup(credentials) {

        authService.signup(credentials)
            .then(user => {
                setLoggedInUser(user)
                showSuccessMsg('Signed in successfully')
                navigate('/bug')
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg(`Couldn't signup`)
            })
    }


    return (
        <div className="login-page">
            <form className="login-form" onSubmit={handleSubmit}>
                <input type="text"
                    name="username"
                    value={credentials.username}
                    placeholder="Username"
                    onChange={handleChange}
                    required
                    autoFocus />

                <input
                    type="password"
                    name="password"
                    value={credentials.password}
                    placeholder="Password"
                    onChange={handleChange}
                    required
                    autoComplete="off"
                />

                {isSignup && <input type="text"
                    name="fullname"
                    value={credentials.fullname}
                    placeholder="Your full name"
                    onChange={handleChange}
                    required
                    autoFocus />}

                <button>{isSignup ? 'Signup' : 'Login'}</button>
            </form>

            <div className="btns">
                <a onClick={() => setIsSignUp(!isSignup)}>
                    {isSignup ?
                        'Already a member? Login' :
                        'New user? Signup here'
                    }
                </a >
            </div>
        </div>
    )
}