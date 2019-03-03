const mongoose = require('mongoose');

const Schema = mongoose.Schema

const paymentSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    amount:{
        type: Number,
        required: true
    },
    email: {
        type: String,
        require: true
    },
    ref: {
        type: String,
        required: true,
    }

})

const payment = mongoose.model('payment', paymentSchema);
module.exports = payment;