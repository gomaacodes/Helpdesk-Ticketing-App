import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom'
import { CATEGORIES } from "../../config/categories" 
import { STATUSES } from "../../config/statuses" 

import { useSelector } from 'react-redux'
import { selectTicketById } from './ticketsApiSlice'

const Ticket = ({ ticketId }) => {
    const ticket = useSelector(state => selectTicketById(state, ticketId))
    const navigate = useNavigate()

    if (ticket) {
        const created = new Date(ticket.createdAt).toLocaleString('en-US', { hour: 'numeric', day: '2-digit', month: '2-digit', year: 'numeric' })
        const updated = new Date(ticket.updatedAt).toLocaleString('en-US', { hour: 'numeric', day: '2-digit', month: '2-digit', year: 'numeric' })
        const numOfLogs = ticket.progressLog.length
        const handleEdit = () => navigate(`/dash/tickets/${ticketId}`)

        return (
            <div className="ticket">
                <div className="ticket__header">
                    <div className='ticket__header__left'>
                        <h3 className="ticket__title">{ticket.title}</h3>
                        <h5 className="ticket__category">{CATEGORIES[ticket.category]}</h5>
                    </div>
                    <div className='ticket__header__right'>
                        <button
                            className="icon-button"
                            onClick={handleEdit}
                        >
                            <FontAwesomeIcon icon={faPenToSquare} />
                        </button>
                    </div>
                </div>
                <div className='ticket__date'>
                    {!updated ? created : updated}
                </div>
                <hr className="ticket__divider"/>
                <div className="ticket__urgency">
                    {[...Array(5)].map((_, index) => {
                    const isActive = index + 1 <=  ticket.urgency;
                    return (
                    <div
                        key={index + 1}
                        className = "urgency__circle"
                        id={`${isActive ? "urgency__circle--active" + ticket.urgency : "" }`}
                    ></div>
                    );
                })}
                </div>


                <div className="ticket__content">
                <div className="ticket__description">
                    <p>
                        {!numOfLogs ? ticket.description : ticket.progressLog[numOfLogs - 1]}
                    </p>
                </div>
                </div>
                
                <div className="ticket__footer">
                    <span className="ticket__footer__left">{ticket.usernames[0]}</span>
                    <span className="ticket__footer__right">{STATUSES[ticket.statusCode]}</span>
                </div>
            </div>
        )

    } else return null
}

export default Ticket