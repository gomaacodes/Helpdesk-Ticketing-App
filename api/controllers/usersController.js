const User = require('../models/User')
const Ticket = require('../models/Ticket')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean()
    if (!users?.length) {
        return res.status(400).json({ message: `No users found.` })
    }
    res.json(users)
})

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
    const { username, password, roles } = req.body
    if (!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ message: 'All fields are required.' })
    }
    
    const dublicate = await User.findOne({username}).lean().exec()
    if (dublicate) {
        return res.status(409).json({ message: 'Username already exists' })
    }

    const hashedPwd = await bcrypt.hash(password, 10)
    const userObject = { username, "password": hashedPwd, roles }

    const user = await User.create(userObject)
    if (user) {
        res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }
})

// @desc Update a  user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
    const {id, username, roles, active, password} = req.body
    if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields except password are required.' })
    }

    const user = await User.findById(id).exec()
    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const dublicate = await User.findOne({username}).lean().exec()
    if (dublicate && dublicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Username already exists' })
    }

    user.username = username
    user.roles = roles
    user.active = active
    if (password) user.password = await bcrypt.hash(password, 10)

    const updatedUser = await user.save()

    res.json({message: `${updatedUser.username} updated`})
})

// @desc Delete a  user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body
    if ( !id ) {
        return res.status(400).json({ message: 'User ID required.' })
    }

    const ticket = await Ticket.findOne({ users: id }).lean().exec()
    if (ticket) {
        return res.status(400).json({message: 'User has assigned Tickets'})
    }

    const user = await User.findById(id).exec()
    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const reply = `Username ${user.username} with ID ${user._id} deleted`
    const result = await user.deleteOne()
    res.json(reply)
})

module.exports = {
    getAllUsers, 
    createNewUser,
    updateUser,
    deleteUser
} 