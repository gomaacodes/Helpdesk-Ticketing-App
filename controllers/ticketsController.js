const Ticket = require('../models/Ticket')
const asyncHandler = require('express-async-handler')

// @desc Get all tickets
// @route GET /tickets
// @access Private
const getAllTickets = asyncHandler(async (req, res) => {
    const tickets = await Ticket.find().lean()
    if (!tickets?.length) {
        return res.status(400).json({ message: `No tickets found.` })
    }
    res.json(tickets)
})

// { user, title, description, category, urgency, statusCode, progressLog }

// @desc Create new ticket
// @route POST /tickets
// @access Private
const createNewTicket = asyncHandler(async (req, res) => {
    const { user, title, description, category, urgency } = req.body

    if ( !Array.isArray(user) || !user.length  || !title || !description || !category || !urgency ) {
        return res.status(400).json({ message: 'All fields are required.' })
    }
    
    /* const dublicate = await User.findOne({username}).lean().exec()
    if (dublicate) {
        return res.status(409).json({ message: 'Username already exists' })
    } */

    // const userObject = { username, "password": hashedPwd, roles }
    const ticketObject = { user, title, description, category, urgency }

    const ticket = await Ticket.create(ticketObject)
    if (ticket) {
        res.status(201).json({ message: `New ticket ${ticket.ticket} created` })
    } else {
        res.status(400).json({ message: 'Invalid ticket data received' })
    }
})

// @desc Update a  ticket
// @route PATCH /tickets
// @access Private
const updateTicket = asyncHandler(async (req, res) => {
    const { id, user, title, description, category, urgency, statusCode, progressLog } = req.body
    if ( !id ) {
        return res.status(400).json({ message: 'Id field is required.' })
    }

    const ticket = await Ticket.findById(id).exec()
    if (!ticket) {
        return res.status(400).json({ message: 'Ticket not found' })
    }

    /* const dublicate = await Ticket.findOne({username}).lean().exec()
    if (dublicate && dublicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Username already exists' })
    }
 */
    // FIX : don't allow for dublicate user entries
    if (user) {
        const usersArray  = ticket.user
        usersArray.push(user)
        ticket.user = usersArray
    } 
    if (title) ticket.title = title
    if (description) ticket.description = description
    if (category) ticket.category = category
    if (urgency) ticket.urgency = urgency
    if (statusCode) ticket.statusCode = statusCode
    if (progressLog) ticket.progressLog.concat(progressLog)
    

    const updatedTicket = await ticket.save()

    res.json({message: `${updatedTicket.ticket} updated`})
})

// @desc Delete a  user
// @route DELETE /users
// @access Private
const deleteTicket = asyncHandler(async (req, res) => {
    const { id } = req.body
    if ( !id ) {
        return res.status(400).json({ message: 'Ticket ID required.' })
    }

    const ticket = await Ticket.findById(id).exec()
    if (!ticket) {
        return res.status(400).json({ message: 'Ticket not found' })
    }

    const reply = `Ticket No.${ticket.ticket} deleted`
    const result = await ticket.deleteOne()
    res.json(reply)
})

module.exports = {
    getAllTickets, 
    createNewTicket,
    updateTicket,
    deleteTicket
} 