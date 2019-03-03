const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const boughtTicketSchema = new Schema({
    buyerName:{
        type: String,
        required: true,
    
    },
    // userId: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'ticketUsers'
    // },
    ticketId: {
        type: Schema.Types.ObjectId,
        ref: 'tickets'
    },
    paymentRef:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const BoughtTicket = mongoose.model('boughtTickets', boughtTicketSchema);
module.exports = BoughtTicket;