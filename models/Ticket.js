const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ticketSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    // userId: {
    //     type: Schema.Types.ObjectId,
    //     ref:'ticketUsers'
    // },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
});

const Ticket = mongoose.model('tickets',ticketSchema);
module.exports = Ticket;