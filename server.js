const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

//Setup the rest endpoint
const payment = require('./routes/payments');
const ticket = require('./routes/tickets')
const user = require('./routes/users')
//initiallize the appication
const app = express();

//allow cross side request
app.use(cors());

//setup body-perser
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//setup db
const db = require('./config/keys_dev').mongoURI;

//connect to database
mongoose.connect(db,{useNewUrlParser: true})
    .then(() =>console.log('mongoDb connected'))
    .catch((err) => console.log("Error connecting to Cloud db"));

//setup auth and more


//Route middleware
app.use('/payments',payment);
app.use('/tickets',ticket);
app.use('/users',user);

const port = process.env.PORT || 5000;
app.listen(port,  () =>{
    console.log(`Server running on port ${port}`)
})

