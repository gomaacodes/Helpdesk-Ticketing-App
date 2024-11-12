import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons"
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useSendLogoutMutation } from '../features/auth/authApiSlice';

const DASH_REGEX = /^\/dash(\/)?$/
const TICKETS_REGEX = /^\/dash\/notes(\/)?$/
const USERS_REGEX = /^\/dash\/users(\/)?$/

const DashHeader = () => {
    const navigate = useNavigate()
    const { pathname } = useLocation()

    const [sendLogout, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useSendLogoutMutation()

    useEffect(() => {
        if (isSuccess){
            //navigate('/login') Doesn't Work here
        }
    }, [isSuccess, navigate])

    if (isLoading) return <p>Logging Out...</p>

    if (isError) return <p>Error: {error.data?.message}</p>

    const handleSendLogout = () => {
        sendLogout()
        navigate('/login')
    }

    let dashClass = null
    if (!DASH_REGEX.test(pathname) && !TICKETS_REGEX.test(pathname) && !USERS_REGEX.test(pathname)) {
        dashClass = "dash-header__container--small"
    }

    const logoutButton = (
        <button
            className="icon-button"
            title="Logout"
            onClick={handleSendLogout}
        >
            <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
    )
    
    const content = (
        <header className="dash-header">
            <div className={`dash-header__container ${dashClass}`}>
                <Link to="/dash">
                    <h1 className="dash-header__title">TechKits</h1>
                </Link>
                <nav className="dash-header__nav">
                    {/* add nav buttons later */}
                    {logoutButton}
                </nav>
            </div>
        </header>
    )

    return content
}

export default DashHeader