const express = require('express');
const app = express();
const cors = require('cors');
const helmet = require('helmet');


// Cool trick for when promises or other complex callstack things are crashing & breaking:
void process.on('unhandledRejection', (reason, p) => {
    console.log(`Things got pretty major here! Big error:\n`+ p);
    console.log(`That error happened because of:\n` + reason);
});


// Set values for the server's address
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

// Set server security
app.use(helmet());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.contentSecurityPolicy({
    directives:{
        defaultSrc:["'self'"]
    }
}));

// Configure API data receiving & sending
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Set up CORS. It controls what requests can come through to our app, Who can contact the API.
var corsOptions = {
    origin: ["http://localhost:3000"],
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

require('dotenv').config(); //it loads up the env file and ready to go, without storing it into a variable. 

// console.log("Firebase project ID is: " + process.env.FIREBASE_ADMIN_PROJECT_ID)


// Actual server behaviour
app.get('/', (req, res) => { // example of req: authorisation, form data. Res is what the server send back to the front end.
    console.log('ExpressJS API homepage received a request.');
  
    const target = process.env.NODE_ENV || 'not yet set';
    res.json({
        'message':`Hello ${target} world, wohoooo!`
    });

});

module.exports = {
    app, PORT, HOST
}