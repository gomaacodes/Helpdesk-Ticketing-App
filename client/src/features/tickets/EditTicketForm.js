import { useState, useEffect } from "react"
import { useUpdateTicketMutation, useDeleteTicketMutation } from "./ticketsApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import { CATEGORIES } from "../../config/categories"
import { STATUSES } from "../../config/statuses"

const EditTicketForm = ({ ticket, allUsers }) => {
    const [updateTicket, {
        isLoading,
        isSuccess,
        isError,
        error }] = useUpdateTicketMutation()

    const [deleteTicket, {
        isSuccess: isDelSuccess,
        //isError: isDelError,
        error: delError }] = useDeleteTicketMutation()

    const navigate = useNavigate()

    const [title, setTitle] = useState(ticket.title)
    const [category, setCategory] = useState(ticket.category)
    const [urgency, setUrgency] = useState(ticket.urgency)
    const [description, setDescription] = useState(ticket.description)
    const [users, setUsers] = useState(ticket.users)
    const [progressLog, setProgressLog] = useState(ticket.progressLog)
    const [newProgressLog, setNewProgressLog] = useState('')
    const [statusCode, setStatusCode] = useState(ticket.statusCode)
    const [hover, setHover] = useState(null)


    useEffect(() => {
        if (isSuccess || isDelSuccess) {
            setTitle('')
            setCategory(null)
            setUrgency(0)
            setDescription('')
            setUsers([])
            setProgressLog([])
            setStatusCode(null)
            navigate('/dash/tickets')
        }
    }, [isSuccess, isDelSuccess, navigate])

    const onTitleChanged = e => setTitle(e.target.value)
    const onCategoryChanged = e => setCategory(e.target.value)
    const onUrgencyChanged = (index) => { setUrgency(index) }                       // Do I even need that line???
    const onUsersChanged = e => {
        const values = Array.from(e.target.selectedOptions,(option) => option.value)
        setUsers(values)
    }
    const onNewProgressLogChanged = e => setNewProgressLog(e.target.value)
    const onStatusCodeChanged = e => setStatusCode(e.target.value)

    const canSave = [title.length, category > 0, urgency > 0, description.length].every(Boolean) && !isLoading

    const onSaveTicketClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            // Start by creating the payload with the required fields
            const ticketToSave = {id: ticket.id ,title ,category ,urgency ,description ,statusCode};

            // Add optional fields if they are not empty
            if (users?.length) ticketToSave.users = users 
            if (progressLog?.length || newProgressLog) {
                ticketToSave.progressLog = [...progressLog, newProgressLog].filter(Boolean)
            }

            await updateTicket(ticketToSave)
        }
    }

    const onDeleteTicketClicked = async () => {
        await deleteTicket({ id: ticket.id })
    }

    const ctgries = { ...CATEGORIES, 0: '' }
    const categories = Object.keys(ctgries).map(ctgry => {
        return (
            <option
                key={parseInt(ctgry)}
                value={parseInt(ctgry)}
            >{ctgries[ctgry]}</option>
        )
    })

    const sttes = { ...STATUSES, 0: '' }
    const statuses = Object.keys(sttes).map(stt => {
        return (
            <option
                key={parseInt(stt)}
                value={parseInt(stt)}
            >{sttes[stt]}</option>
        )
    })

    const userOptions = Object.values(allUsers).map(user => {
        return(
          <option
            key={user.username}
            value={user.id}
          >{user.username}</option>
        )
      })

    const errClass = isError ? "errmsg" : "offscreen"
    const validTitleClass = !title.length ? 'form__input--incomplete' : ''
    const validCategoryClass = category == null ? 'form__input--incomplete' : ''
    const validDescriptionClass = !description.length ? 'form__input--incomplete' : ''
    const errContent = (error?.data?.message || delError?.data?.message) ?? ''

    const content = (
        <>
            <p className={errClass}>{errContent}</p>
            <div className="background">
                <form className="form" onSubmit={e => e.preventDefault()}>
                    <div className="form__title-row">
                        <h2>Edit Ticket</h2>
                        <div className="form__action-buttons">
                            <button
                                className="icon-button"
                                title="Save"
                                onClick={onSaveTicketClicked}
                                disabled={!canSave}
                            >
                                <FontAwesomeIcon icon={faSave} />
                            </button>
                            <button
                                className="icon-button"
                                title="Delete"
                                onClick={onDeleteTicketClicked}
                            >
                                <FontAwesomeIcon icon={faTrashCan} />
                            </button>
                        </div>
                    </div>
                    <label className="form__label" htmlFor="title">Title:</label>
                    <input
                        className={`form__input ${validTitleClass}`} // not an actual css class 
                        id="title"
                        name="title"
                        type="text"
                        autoComplete="off"
                        value={title}
                        onChange={onTitleChanged}
                    />

                    <label className="form__label" htmlFor="category">Category:</label>
                    <select
                        id="category"
                        name="category"
                        className={`form__select ${validCategoryClass}`} // not an actual css class 
                        value={category}
                        onChange={onCategoryChanged}
                    >
                        {categories}
                    </select>

                    <label className="form__label" htmlFor="urgency">Urgency:</label>
                    <div
                        className="form__urgency"
                        tabIndex="0"
                        onKeyDown={(e) => {
                            const hIndex = hover === null && urgency > 0 ? urgency : null
                            if (["ArrowLeft", "ArrowDown"].includes(e.key) && ((hover ?? urgency) > 1)) setHover((hIndex ?? hover) - 1);
                            else if (["ArrowRight", "ArrowUp"].includes(e.key) && ((hover ?? urgency) < 5)) setHover((hIndex ?? hover) + 1);
                            else if (["Enter", " "].includes(e.key)) { setUrgency(hover); setHover(null) }
                        }}>
                        {[...Array(5)].map((_, index) => {
                            const isActive = urgency !== null && index + 1 <= urgency;
                            const isHovered = hover !== null && index + 1 <= hover;
                            return (
                                <div
                                    key={index + 1}
                                    className="urgency__circle"
                                    id={`${isHovered ? "urgency__circle--hover" : isActive ? "urgency__circle--active" + urgency : ""}`}
                                    onClick={() => {
                                        onUrgencyChanged(index + 1)
                                        setHover(null)
                                    }}
                                    onMouseEnter={() => { setHover(index + 1) }} // Set hover index on mouse enter
                                    onMouseLeave={() => { setHover(null) }}  // Clear hover index on mouse leave
                                ></div>
                            );
                        })}
                    </div>

                    <label className="form__label" htmlFor="description">Description:</label>
                    <textarea
                        readOnly
                        className={`form__input--description form__input--text ${validDescriptionClass}`} // not an actual css class 
                        id="description"
                        name="description"
                        type="text"
                        autoComplete="off"
                        value={description}
                        onChange={() => {}} //REMOVE THIS IS JUST TO GET RID OF THE ANNOYING ERROR 
                    />

                    <label className="form__label" htmlFor="newProgressLog">Add Progress Log:</label>
                    <textarea
                        id="newProgressLog"
                        name="newProgressLog"
                        className="form__input--progresslog form__input--text"
                        rows="3"
                        onChange={onNewProgressLogChanged}
                    />

                    <label className="form__label" htmlFor="progressLogs">Progress Logs:</label>
                    <div className="form__progress-log-container">
                        {progressLog.length ? (
                            progressLog.map((log, index) => (
                                <div key={index} className="form__progress-log-entry">{log}</div>
                            ))
                        ) : (
                            <p>No progress logs available.</p>
                        )}
                    </div>

                    <label className="form__label" htmlFor="assignedUsers">Assigned Users:</label>
                    <select
                        id="users"
                        name="users"
                        className= 'form__select' // not an actual css class 
                        multiple={true}
                        size={userOptions.length}
                        value={users}
                        onChange={onUsersChanged}
                    >
                        {userOptions}
                    </select>

                    <label className="form__label" htmlFor="statusCode">Status:</label>
                    <select
                        id="statusCode"
                        name="statusCode"
                        className={`form__select`}
                        value={statusCode}
                        onChange={onStatusCodeChanged}
                    >
                        {statuses}
                    </select>
                </form>
            </div>
        </>
    )

    return content
}

export default EditTicketForm