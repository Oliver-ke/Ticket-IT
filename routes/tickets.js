const router = require('express').Router();
const ticketValidator = require('../validator/ticketValidator')
const Ticket = require('../models/Ticket');

//route: /tickets
//access: public
// method: GET
//desc: Get all available ticket
router.get('/',(req,res) =>{
    //handle requiest
    Ticket.find()
        .sort({date: -1})
        .then(tickets =>{
            res.json(tickets)
        })
        .catch(err => res.json({msg: 'error geting tickets'}))
})

//route: /tickets/:id
//access: public
//method: GET
//desc: gets a particular ticket with details
router.get('/:id', (req,res) =>{
    const {id} = req.params
    if(id){
        Ticket.findById(id)
            .then(ticket => res.json(ticket))
            .catch(err => { console.log(err); res.json({msg: 'error occured'})});
    }
    else{
        res.json({msg: 'no ticket with the given id'})
    }
})

//@route: /ticket
//@access: private
//@method: POST
router.post('/', (req,res) =>{
    const data = req.body;
    const {isValid,errors} = ticketValidator(data);
    if(!isValid){
        res.json(errors)
    }
    else{
        const newTicket = new Ticket(data);
        newTicket.save()
            .then(ticket => res.json(ticket))
            .catch(err => {console.log(err); res.json({msg: 'error occured'})});
    }
})

//@route: /delete/:id
//@access: private
//@method: DELETE
router.delete('/delete/:id', (req,res) =>{
    //check for the users normal
    const id =req.params.id;
    if(id){
        Ticket.findById(id)
            .then(ticket => {
                ticket.remove()
                    .then(res.json({succes: true}))
                    .catch(err => console.log(err))
            })
            .catch(err => {console.log(err); res.json({success: false})})
    }
    else{
        res.json({msg: 'please provide a valid id'})
    }  
})

module.exports = router;
