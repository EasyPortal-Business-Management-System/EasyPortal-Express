const express = require('express');

const routes = express.Router();

const {signUpUser, signInUser, validateUserSession, deleteClient, listAllClient, logOut} = require ('./UserFunctions');

const {createSpecificEmployee} = require ('../Rosters/RostersFunctions')

// Create a user, a session token & a refresh token
routes.post('/sign-up', async (request, response) => {
    // Process posted form/json data
    let newUserDetails = {
        email: request.body.email,
        password: request.body.password,
        displayName: request.body.displayName
    }
    // Ideally perform validation on those properties before moving on.
    // Not in the scope of this guide though! ;) 

    // Hand data to a sign-up function
    let signUpResult = await signUpUser({displayName: newUserDetails.displayName, email:newUserDetails.email, password: newUserDetails.password});
    // Return error or token as response
    if (signUpResult.error != null){
        console.log("Stopping the signup process due to an error. See logs for details.");
        response.json(signUpResult);
        return;
    }

    // Sign in to get latest user claims (authorization).
    let signInResult = await signInUser({displayName: newUserDetails.displayName, email:newUserDetails.email, password: newUserDetails.password});
    
    // If an error message exists, return that.
    if (signInResult.error != null){
        console.log("Stopping the signup process due to an error. See logs for details.");
        response.json(signInResult);
        return;
    }

    let mongoDBuser = await createSpecificEmployee (
        {
            displayName: signInResult.displayName, 
            employeeID: signInResult.uid, 
            
            Monday: '',
            Tuesday: '',
            Wednesday: '',
            Thursday: '',
            Friday: '',
            Saturday: '',
            Sunday: ''
    })

    if (mongoDBuser.error != null){
        console.log("Stopping the signup process due to an error. See logs for details.");
        response.json(mongoDBuser);
        return;
    }

    // On success, return a signed-in session to the brand-new user:
    response.json(signInResult);
});

// Create a session token & refresh token
routes.post('/sign-in', async (request, response) => {
    // Process posted form/json data
    let userDetails = {
        email: request.body.email,
        password: request.body.password,
        displayName: request.body.displayName
    }
    // Ideally perform validation on those properties before moving on.
    // Not in the scope of this guide though! ;) 

    // Hand data to a sign-in function
    let signInResult = await signInUser({displayName: userDetails.displayName, email:userDetails.email, password:userDetails.password});
    
    // If an error message exists, return that.
    if (signInResult.error != null){
        console.log("Stopping the signup process due to an error. See logs for details.");
        response.json(signInResult);
        return;
    }

    // On success, return a signed-in session to the brand-new user:
    response.json(signInResult);
});

// Create a session token & refresh token
routes.post('/validate-session', async (request, response) => {
    // Process posted form/json data
    let sessionDetails = {
        idToken: request.body.idToken,
        refreshToken: request.body.refreshToken,
    }

    // Hand data to a validation function
    let validationResult = await validateUserSession({displayName: sessionDetails.displayName, refreshToken: sessionDetails.refreshToken, idToken:sessionDetails.idToken})
    
    // Return error or token as response
    response.json(validationResult);
});

//List all Users /users/

routes.get('/', async (request, response) => {
    let seeAllResult = await listAllClient();
    //  response.json({
    //    "message": `Received a request on ${request.originalUrl}`
    // })
    return response.json(seeAllResult);   
});


// delete user
routes.delete('/delete/:uid', async (request, response) => {
    // Process posted form/json data
    // let userDetails = {
    //     uid: request.body.uid
    // }

    // Hand data to a validation function
    let deletionResult = await deleteClient(request.params.uid)
    
    // Return error or token as response
    response.json(deletionResult);
});

routes.post('/sign-out', async (request, response) => {
    let logoutResult = await logOut()
    response.json(logoutResult)
})

module.exports = routes;