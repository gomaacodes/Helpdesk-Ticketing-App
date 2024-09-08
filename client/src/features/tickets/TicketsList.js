import { useGetTicketsQuery } from "./ticketsApiSlice"
import Ticket from "./Ticket"

const TicketsList = () => {
  const {
    data: tickets,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetTicketsQuery()

  let content

  if (isLoading) {content = <p>Loading...</p>}
  if (isError) {content = <p className= "errmsg">{error?.data?.message}</p>}
  if (isSuccess) {
    const { ids } = tickets
    const ticketContent = ids.length ?
      ids.map(ticketId => <Ticket key={ticketId} ticketId={ticketId} />) :
      null
    content = (
      <div className = "ticketlist__main">
        {ticketContent}
      </div>
    )
  }
  return content
}

export default TicketsList