const validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = ticketValidator = data =>{
    console.log('i was called')
    let errors = {}
    data.name = !isEmpty(data.name) ?  data.name : '';
    data.amount = !isEmpty(data.amount) ? data.amount : '';
    data.description = !isEmpty(data.description) ? data.description : '';
    
    if(validator.isEmpty(data.name)){
        errors.name = 'Name of ticket can not be empty'
    }
    if(!validator.isNumeric(data.amount)){
        errors.amount = 'amount should be a number'
    }
    if(validator.isEmpty(data.amount)){
        errors.amount = 'amount is empty'
    }
    if(validator.isEmpty(data.description)){
        errors.description = 'Please add a ticket description'
    }

    return{
        errors,
        isValid: isEmpty(errors)
    }
}