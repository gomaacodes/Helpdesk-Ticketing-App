import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectTicketById } from "./ticketsApiSlice"
import { selectAllUsers } from "../users/usersApiSlice"
import EditTicketForm from "./EditTicketForm"

const EditTicket = () => {
  const { id } = useParams()

  const ticket = useSelector(state => selectTicketById(state, id))
  const allUsers = useSelector(selectAllUsers)

  const content = ticket && allUsers ? <EditTicketForm ticket={ticket} allUsers={allUsers} /> : <p>Loading...</p>
  return content  
}

export default EditTicket