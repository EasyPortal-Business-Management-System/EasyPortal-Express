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

// Set up CORS. It controls what requests can come through to our app, Who can contact the API. So this is for the frontend URI
var corsOptions = {
    origin: ["http://localhost:3000", "https://www.easyportal-businessmanagement.com"],
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

require('dotenv').config(); //it loads up the env file and ready to go, without storing it into a variable. 

console.log("Firebase project ID is: " + process.env.FIREBASE_ADMIN_PROJECT_ID)


//initilize firebase
const firebaseAdmin = require('firebase-admin');
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({// we need build a certificate and using a custom data, not locked in to firebase. ie. deployment database, we need to build our own certificate. 
        "projectId": process.env.FIREBASE_ADMIN_PROJECT_ID,
        "privateKey": process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
        "clientEmail": process.env.FIREBASE_ADMIN_CLIENT_EMAIL
    })  

});


const {databaseConnector} = require('./database');

// databaseConnector("some mongo string")

// if it's a not a test environment
if (process.env.NODE_ENV != "test") {
    const DATABASE_URI = process.env.DATABASE_URI || "mongodb://localhost:27017/easyportaldatabase" 
    //what is 27017 coming from, and why when I changed it, it'll fail ? 27017 is the default mongoose url
    databaseConnector(DATABASE_URI).then(() => {
        // if database connection succeeded, log a nice success message
        console.log("You've connected to Database!!")
    }).catch(error => {
        // if database connection failed, log the error
        console.log(`
        Some error occured, it was: 
        ${error}
        `)
    });
}

// ====================================================================================================
// Config above
// Routes Below

// Actual server behaviour
app.get('/', (req, res) => { // example of req: authorisation, form data. Res is what the server send back to the front end.
    console.log('ExpressJS API homepage received a request.');
  
    const target = process.env.NODE_ENV || 'not yet set'; // NODE_ENV is from when you start nodemon in development environment
    res.json({
        'message':`Hello, you're now connected to ${target} world!`
    });

}); // because there is no res.send in the router so we're not sending anything yet to the front end yet


const importedUserRouting = require('./Users/UserRoutes');
app.use('/users', importedUserRouting)

const importedRosterRouting = require('./Rosters/RostersRoutes');
app.use('/employees', importedRosterRouting);

module.exports = {
    app, PORT, HOST
}