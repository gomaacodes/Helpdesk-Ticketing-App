import { store } from '../../app/store'
import { ticketsApiSlice } from '../tickets/ticketsApiSlice'
import { usersApiSlice } from '../users/usersApiSlice'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

const Prefetch = () => {
    useEffect(() => {
        const tickets = store.dispatch(ticketsApiSlice.endpoints.getTickets.initiate())
        const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate())
        return () => {
            tickets.unsubscribe()
            users.unsubscribe()
        }
    }, [])

    return <Outlet />
}

export default Prefetch