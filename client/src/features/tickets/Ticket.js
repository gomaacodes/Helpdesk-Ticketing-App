import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom'

import { useSelector } from 'react-redux'
import { selectTicketById } from './ticketsApiSlice'

const Ticket = ({ ticketId }) => {
    const ticket = useSelector(state => selectTicketById(state, ticketId))
    const navigate = useNavigate()

    if (ticket) {
        const created = new Date(ticket.createdAt).toLocaleString('en-US', { hour: 'numeric', day: '2-digit', month: '2-digit', year: 'numeric' })
        const updated = new Date(ticket.updatedAt).toLocaleString('en-US', { hour: 'numeric', day: '2-digit', month: '2-digit', year: 'numeric' })
        const handleEdit = () => navigate(`/dash/tickets/${ticketId}`)

        return (
            <div class="ticket">
            <div class="ticket__header">
                <div className='ticket__header__left'>
                    <h3 class="ticket__title">{ticket.title}</h3>
                    <h5 class="ticket__category">{ticket.category}</h5>
                </div>
                <div className='ticket__header__right'>
                    <FontAwesomeIcon icon={faPenToSquare} />
                </div>
            </div>
            <div className='ticket__date'>
                {!updated ? created : updated}
            </div>
            <hr class="ticket__divider"/>
            <div class="ticket__urgency">
                <div class="ticket__urgency__circle"></div>
                <div class="ticket__urgency__circle"></div>
                <div class="ticket__urgency__circle"></div>
                <div class="ticket__urgency__circle"></div>
                <div class="ticket__urgency__circle"></div>
            </div>
            <div class="ticket__content">
              <div class="ticket__description">
                <p>
                    {ticket.description}
                </p>
              </div>
            </div>
            
            <div class="ticket__footer">
                <span class="ticket__footer__left">{ticket.usernames[0]}</span>
                <span class="ticket__footer__right">{ticket.statusCode}</span>
            </div>
        </div>
        
            

            /*  <tr className="table__row">
                <td className="table__cell ticket__status">
                    {ticket.completed
                        ? <span className="ticket__status--completed">Completed</span>
                        : <span className="ticket__status--open">Open</span>
                    }
                </td>
                <td className="table__cell ticket__created">{created}</td>
                <td className="table__cell ticket__updated">{updated}</td>
                <td className="table__cell ticket__title">{ticket.title}</td>
                <td className="table__cell ticket__username">{ticket.username}</td>

                <td className="table__cell">
                    <button
                        className="icon-button table__button"
                        onClick={handleEdit}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </td>
            </tr> */
        )

    } else return null
}

export default Ticket