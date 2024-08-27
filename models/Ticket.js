const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)
const ticketSchema = new mongoose.Schema(
    {
        users: [{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        }],
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        category: {
            type: Number,
            required: true
        },
        urgency: {
            type: Number,
            required: true
        },
        statusCode: {
            type: Number,
            default: 0
        },
        progressLog: [String]
    },
    {
        timestamps: true
    }
)

ticketSchema.plugin(AutoIncrement, {
    inc_field: 'ticket',
    id: 'ticketNums',
    start_seq: 6717
})

module.exports = mongoose.model('Ticket', ticketSchema)