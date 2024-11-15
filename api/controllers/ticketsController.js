const Ticket = require('../models/Ticket')
const User = require('../models/User')
const asyncHandler = require('express-async-handler')

// @desc Get all tickets
// @route GET /tickets
// @access Private
const getAllTickets = asyncHandler(async (req, res) => {
    const tickets = await Ticket.find().lean()
    if (!tickets?.length) {
        return res.status(400).json({ message: `No tickets found.` })
    }

    // Spare Me, Just for a few days
    const ticketsWithNames = await Promise.all(tickets.map(async ticket => {
        
        // IF the Order of returned Usernames MATTERS
        /* const usernames = []
        for (const user of ticket.users) {
            const userId = user.toString()
            const userObj = await User.findById(userId).lean().exec()
            usernames.push(userObj.username)
        } */

        // IF the Order of returned Usernames DOESN'T MATTER
        const usernames = await Promise.all(ticket.users.map(async user => {
            const userId = user.toString()
            const userObj = await User.findById(userId).lean().exec()
            return (userObj.username)
        }))
        return {...ticket, usernames}      
    }))

    res.json(ticketsWithNames)
})

// { user, title, description, category, urgency, statusCode, progressLog }

// @desc Create new ticket
// @route POST /tickets
// @access Public
const createNewTicket = asyncHandler(async (req, res) => {
    const { title, category, urgency, description, statusCode } = req.body

    if ( !title || !description || !category || !urgency ) {
        return res.status(400).json({ message: 'All fields are required.' })
    }
    
    /* const dublicate = await User.findOne({username}).lean().exec()
    if (dublicate) {
        return res.status(409).json({ message: 'Username already exists' })
    } */

    // const userObject = { username, "password": hashedPwd, roles }
    const ticketObject = { title, category, urgency, description, statusCode }

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
    const { id, title, category, urgency, description, users, progressLog, statusCode } = req.body
    if ( !id ) {
        return res.status(400).json({ message: 'Id field is required.' })
    }

    const ticket = await Ticket.findById(id).exec()
    if (!ticket) {
        return res.status(400).json({ message: 'Ticket not found' })
    }

    if (users) ticket.users = users
    if (title) ticket.title = title
    if (description) ticket.description = description
    if (category) ticket.category = category
    if (urgency) ticket.urgency = urgency
    if (statusCode) ticket.statusCode = statusCode
    if (progressLog) ticket.progressLog = progressLog
 
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