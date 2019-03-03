const router = require('express').Router();
const Ticket = require('../models/Ticket');
const BoughtTicket = require('../models/BoughtTicket');

//@route: /payment/pay
//@access: public
//@method: POST
//@disc: initialize payment request and sends redirect url
router.post('/pay', (req,res) =>{
    const {id,fullname,amount,email} = req.body;
    const {initializePayment} = require('../config/paystack')()
    const data = {amount,email};
    data.amount *= 100;
    data.metadata = { id,  fullname }
    initializePayment(data, (result)=>{
        res.json(result.data);
    });
})

//@route: /payment/callback
//@access: public
//@method: POST
//@disc: Confarms payment from paystack and saves buyer info to db
router.post('/callback',(req,res) =>{
    const {reference} = req.body;
    const {verifyPayment} = require('../config/paystack')()
    verifyPayment(reference, (result) =>{
        //check for errors
        if(result.status){
            const {amount, reference, customer,transaction_date, metadata} = result.data;
            const {id, fullname} = metadata;
            BoughtTicket.findOne({paymentRef: reference})
                .then(items =>{
                    if(items){
                      return  res.json(result) //added return
                    }
                    else{
                        const newBoughtTicket = new BoughtTicket({
                            amount,
                            paymentRef: reference,
                            date: transaction_date,
                            email: customer.email,
                            buyerName: fullname,
                            ticketId: id,
                        })
                        newBoughtTicket.save()
                            .then(item => res.status(200).json(result))
                            .catch(err => res.status(401).json({err: 'Error saving payment info to db'}))
                    }
                })
                .catch(err => res.status(401).json({mssg: 'Error making search query'}))
        }
        else{
          return  res.status(200).json(result)
        }
    })
})

module.exports = router;