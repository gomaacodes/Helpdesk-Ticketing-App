import { useGetTicketsQuery } from "./ticketsApiSlice"
import Ticket from "./Ticket"
import { CATEGORIES } from "../../config/categories"
import { STATUSES } from "../../config/statuses"
import { useState } from "react"

const TicketsList = () => {
  const {
    data: tickets,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetTicketsQuery('ticketsList', {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  })

  // State for filters and sorting
  const [menuOpen, setMenuOpen] = useState(false)
  const [filterCategory, setFilterCategory] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [filterUrgencyRange, setFilterUrgencyRange] = useState([1, 5]) // Urgency range
  const [sortPrimary, setSortPrimary] = useState("urgency") // Primary sort
  const [sortSecondary, setSortSecondary] = useState("createdAt") // Secondary sort

  let content

  // Handle filtering and sorting logic
  const filterAndSortTickets = (ids) => {
    let filteredTickets = ids

    // Filter by Category
    if (filterCategory) {
      filteredTickets = filteredTickets.filter(ticketId => {
        const ticket = tickets.entities[ticketId]
        return ticket.category === parseInt(filterCategory)
      })
    }

    // Filter by Status
    if (filterStatus) {
      filteredTickets = filteredTickets.filter(ticketId => {
        const ticket = tickets.entities[ticketId]
        return ticket.statusCode === parseInt(filterStatus)
      })
    }

    // Filter by Urgency Range
    filteredTickets = filteredTickets.filter(ticketId => {
      const ticket = tickets.entities[ticketId]
      const urgency = ticket.urgency
      return urgency >= filterUrgencyRange[0] && urgency <= filterUrgencyRange[1]
    })

    // Sort based on primary and secondary sort options
    filteredTickets.sort((a, b) => {
      const ticketA = tickets.entities[a]
      const ticketB = tickets.entities[b]

      // Primary sort: urgency, createdAt, or updatedAt
      if (sortPrimary === "urgency") {
        if (ticketB.urgency !== ticketA.urgency) {
          return ticketB.urgency - ticketA.urgency // Higher urgency comes first
        }
      } else if (sortPrimary === "createdAt") {
        if (new Date(ticketB.createdAt) !== new Date(ticketA.createdAt)) {
          return new Date(ticketB.createdAt) - new Date(ticketA.createdAt) // Newer first
        }
      } else if (sortPrimary === "updatedAt") {
        if (new Date(ticketB.updatedAt) !== new Date(ticketA.updatedAt)) {
          return new Date(ticketB.updatedAt) - new Date(ticketA.updatedAt) // Newer first
        }
      }

      // Secondary sort: createdAt or updatedAt
      if (sortSecondary === "urgency") {
        if (ticketB.urgency !== ticketA.urgency) {
          return ticketB.urgency - ticketA.urgency // Higher urgency comes first
        }
      } else if (sortSecondary === "createdAt") {
        return new Date(ticketB.createdAt) - new Date(ticketA.createdAt)
      } else if (sortSecondary === "updatedAt") {
        return new Date(ticketB.updatedAt) - new Date(ticketA.updatedAt)
      } 

      return 0
    })

    return filteredTickets
  }

  const resetFilterAndSort = () => {
    setFilterCategory("")
    setFilterStatus("")
    setFilterUrgencyRange([1, 5])
    setSortPrimary("urgency")
    setSortSecondary("createdAt")
  }

  if (isLoading) { content = <p>Loading...</p> }
  if (isError) { content = <p className="errmsg">{error?.data?.message}</p> }
  if (isSuccess) {
    const { ids } = tickets

    const filteredAndSortedIds = filterAndSortTickets(ids)
    const ticketContent = filteredAndSortedIds.length ?
      filteredAndSortedIds.map(ticketId => <Ticket key={ticketId} ticketId={ticketId} />) :
      <p>No tickets found matching the criteria.</p>

    content = (
      <>
        <div className="filter-menu"><button
          className="filter-menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          &#x2630;
        </button></div>

        <div className={`filter-menu-container ${menuOpen ? "active" : ""}`}>
          <div className="filter-menu-start">
            <h4 className="filter-menu-header">Filter and Sort Tickets</h4>
            <button
              className="filter-menu-reset"
              onClick={() => resetFilterAndSort()}
            >
              Reset
            </button>
          </div>
          

          {/* Category Filter */}
          <div className="filter-section">
          <h5>Category</h5>
            <div className="category">
              {Object.entries(CATEGORIES).map(([key, value]) => (
                <div key={key}>
                  <input
                    type="radio"
                    id={`category-${key}`}
                    value={key}
                    checked={filterCategory === key}
                    onChange={e => setFilterCategory(e.target.value)}
                  />
                  <label htmlFor={`category-${key}`}>{value}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div className="filter-section">
            <h5>Status</h5>
            {Object.entries(STATUSES).map(([key, value]) => (
              <div key={key}>
                <input
                  type="radio"
                  id={`status-${key}`}
                  value={key}
                  checked={filterStatus === key}
                  onChange={e => setFilterStatus(e.target.value)}
                />
                <label htmlFor={`status-${key}`}>{value}</label>
              </div>
            ))}
          </div>

          {/* Urgency Range Filter */}
          <div className="filter-section">
            <h5>Urgency Range</h5>
            <label>Min:</label>
            <input
              type="number"
              min="1"
              max="5"
              value={filterUrgencyRange[0]}
              onChange={e =>
                setFilterUrgencyRange([parseInt(e.target.value), filterUrgencyRange[1]])
              }
            />
            <label>Max:</label>
            <input
              type="number"
              min="1"
              max="5"
              value={filterUrgencyRange[1]}
              onChange={e =>
                setFilterUrgencyRange([filterUrgencyRange[0], parseInt(e.target.value)])
              }
            />
          </div>

          {/* Sort Options */}
          <div className="filter-section">
            <h5>Sort By</h5>
            <select value={sortPrimary} onChange={e => setSortPrimary(e.target.value)}>
              <option value="urgency">Urgency</option>
              <option value="createdAt">Creation Date</option>
              <option value="updatedAt">Last Updated</option>
            </select>
            <label>Then by:</label>
            <select value={sortSecondary} onChange={e => setSortSecondary(e.target.value)}>
              <option value="urgency">Urgency</option>
              <option value="createdAt">Creation Date</option>
              <option value="updatedAt">Last Updated</option>
            </select>
          </div>
        </div>



        <div className="ticketlist__main">
          {ticketContent}
        </div>
      </>
    )
  }

  return content
}

export default TicketsList
