// Import mongoose functionality ( or to connect )
const mongoose = require('mongoose');

// To make connection to database
async function databaseConnector(databaseURL){
    await mongoose.connect(databaseURL);
}

// To disconnect connection to database
async function databaseDisconnector(){
    await mongoose.connection.close();
}

module.exports = {
    databaseConnector,
    databaseDisconnector
}