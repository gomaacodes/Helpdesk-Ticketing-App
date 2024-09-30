import { useState, useEffect } from "react"
import { useAddNewTicketMutation } from "./ticketsApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSave } from "@fortawesome/free-solid-svg-icons"
import { CATEGORIES } from "../../config/categories"                          // Import Category Codes and Status codes

const NewTicketForm = () => {
  const [addNewTicket, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useAddNewTicketMutation()

  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState(0)
  const [urgency, setUrgency] = useState(0)
  const [hover, setHover] = useState(null)
  const [description, setDescription] = useState('')
  const [statusCode, setStatusCode] = useState(100)


  useEffect(() => {
    if (isSuccess) {
      setTitle('')
      setCategory(0)
      setUrgency(0)
      setDescription('')
      setStatusCode(0)
      navigate('/dash/tickets')
    }
  }, [isSuccess, navigate])

  const onTitleChanged = e => setTitle(e.target.value)
  const onCategoryChanged = e => setCategory(e.target.value)
  const onUrgencyChanged = (index) => {setUrgency(index)}                       // Do I even need that line???
  const onDescriptionChanged = e => setDescription(e.target.value)


  const canSave = [title.length, category !== 0, urgency > 0, description.length].every(Boolean) && !isLoading

  const onSaveTicketClicked = async (e) => {
    e.preventDefault()
    if(canSave) {
      await addNewTicket({title, category, urgency, description, statusCode})
    }
  }

  const ctgries = {...CATEGORIES, 0: ''}
  const categories = Object.keys(ctgries).map(ctgry => {
    return(
      <option
        key={parseInt(ctgry)}
        value={parseInt(ctgry)}
      >{ctgries[ctgry]}</option>
    )
  })
  
  const errClass = isError ? "errmsg" : "offscreen"
  const validTitleClass = !title.length ? 'form__input--incomplete' : ''
  const validCategoryClass = category == null ? 'form__input--incomplete' : ''
  const validDescriptionClass = !description.length ? 'form__input--incomplete' : ''
  const errContent = error?.data?.message

  const content = (
    <>
      <p className={errClass}>{errContent}</p>
      <div className="background">
        <form className="form" onSubmit={onSaveTicketClicked}>
          <div className="form__title-row">
            <h2>Submit Ticket</h2>
            <div className="form__action-buttons">
              <button
                className="icon-button"
                title="Save"
                disabled={!canSave}
              >
                <FontAwesomeIcon icon={faSave} />
              </button>
            </div>
          </div>
          <label className="form__label" htmlFor="title"> Title: </label>
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
          
          <label className="form__label" htmlFor="urgency"> Urgency: </label>
          <div
            className="form__urgency"
            tabIndex="0"
            onKeyDown={(e) => {
              const hIndex = hover === null && urgency > 0 ? urgency : null
              if (["ArrowLeft", "ArrowDown"].includes(e.key) && ((hover ?? urgency) > 1)) setHover((hIndex ?? hover) - 1);
              else if (["ArrowRight", "ArrowUp"].includes(e.key) && ((hover ?? urgency) < 5)) setHover((hIndex ?? hover) + 1);
              else if (["Enter", " "].includes(e.key)) {setUrgency(hover); setHover(null)} 
            }}>
            {[...Array(5)].map((_, index) => {
              const isActive = urgency !== null && index + 1 <=  urgency;
              const isHovered = hover !== null && index + 1 <= hover;
              return (
                <div
                  key={index + 1}
                  className = "urgency__circle"
                  id={`${isHovered ? "urgency__circle--hover" : isActive ? "urgency__circle--active" + urgency : "" }`}
                  onClick={() => {
                    onUrgencyChanged(index + 1)
                    setHover(null)}}
                  onMouseEnter={() => {setHover(index + 1)}} // Set hover index on mouse enter
                  onMouseLeave={() => {setHover(null)}}  // Clear hover index on mouse leave
                ></div>
              );
            })}
          </div>

          <label className="form__label" htmlFor="description"> Description: </label>
          <textarea
            className={`form__input--text ${validDescriptionClass}`} // not an actual css class 
            id="description"
            name="description"
            type="text"
            autoComplete="off"
            value={description}
            onChange={onDescriptionChanged}
          />
        </form>
      </div>
    </>
  )

  return content
}

export default NewTicketForm