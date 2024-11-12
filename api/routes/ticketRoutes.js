const express = require('express')
const router = express.Router()
const ticketsController = require('../controllers/ticketsController')
const verifyJWT = require('../middleware/verifyJWT')

router.route('/')
    .get(verifyJWT, ticketsController.getAllTickets)
    .post(ticketsController.createNewTicket)
    .patch(verifyJWT, ticketsController.updateTicket)
    .delete(verifyJWT, ticketsController.deleteTicket)

module.exports = router