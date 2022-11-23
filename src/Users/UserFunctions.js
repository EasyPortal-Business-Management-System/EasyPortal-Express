// Firebase Admin SDK was initialized elsewhere, we just need access to its functions.
const firebaseAdmin = require('firebase-admin');

// Set up the Firebase Client SDK
const {firebaseConfig} = require('../../keys/firebaseClientKey');
const firebaseClient = require("firebase/app");
// Add the Firebase products that you want to use
const {getAuth, signInWithEmailAndPassword} = require ("firebase/auth");
const { request } = require('express');
// Initialize the Firebase Client SDK
firebaseClient.initializeApp(firebaseConfig);


//--------------------------------
// Config above
// Functions below


// This function is used to sign up the user using firebase method by passing object values
// and then setting role based on a hardcoded email address to identify between admin and general users.
async function signUpUser(userDetails){
    // Use the Firebase Admin SDK to create the user
    return firebaseAdmin.auth().createUser({
        email: userDetails.email, // User email address.
        emailVerified: true, // Required for fuller user functionality.
        password: userDetails.password, 
        displayName: userDetails.displayName, // This is will be the name of the new user
        disabled: false // if a user is banned/usable
    }).then( async (userRecord) => {
        console.log(`\n Raw userRecord is ${JSON.stringify(userRecord)} \n`);
        // Set "Custom Claims" on the new user
            if (userRecord.email === "production@admin.com" || userRecord.email === "production1@admin.com" || userRecord.email === "production2@admin.com" || userRecord.email === "production3@admin.com" || userRecord.email === "production4@admin.com" || userRecord.email === "production5@admin.com" ) {
                
                firebaseAdmin.auth().setCustomUserClaims(userRecord.uid, {adminUser: true}).then(() => {
                console.log("You are an admin user");                
            });
        } else {
            firebaseAdmin.auth().setCustomUserClaims(userRecord.uid, {regularUser: true}).then(() => {
                console.log("you are a regular user");                
            });
        }
        return userRecord;

    }).catch(error => {
        console.log("Internal sign-up function error is: \n" + error);
        return {error:error};
    });
}

// This is a function that derives from firebase to sign in the user and to generate the tokens,
// such as idToken, refresh token, etc.
async function signInUser(userDetails){
    const firebaseClientAuth = getAuth();

    let signInResult = signInWithEmailAndPassword(firebaseClientAuth, userDetails.email, userDetails.password)
    .then(async (userCredential) => {

        let userIdToken = await firebaseClientAuth.currentUser.getIdTokenResult(false);

        console.log(`userIdToken obj is\n ${JSON.stringify(userIdToken)}`);
        if (userIdToken.claims.email === "employer@admin.com" || userIdToken.claims.email === "morgan@admin.com" || userIdToken.claims.email === "tim@admin.com" ) {
            console.log("You are an admin/employer user");   
        } else {
            console.log("You are an employee user");  
        }

        return {
            idToken: userIdToken.token,
            refreshToken: userCredential.user.refreshToken,
            email: userCredential.user.email,
            emailVerified: userCredential.user.emailVerified,
            displayName: userCredential.user.displayName,
            photoURL: userCredential.user.photoURL,
            uid: userCredential.user.uid
        }
    }).catch(error => {
        console.log("Internal signin function error is: \n" + error);
        return {error:error};
    });

    return signInResult;
}


// This function is to validate user session meant to be used for every user interaction, but at this stage
// we decided not to use it, and instead we use custom claims or uid for users to do certain things instead.
// We do have plan to use it in the future that's the reason we leave it here. 
async function validateUserSession(sessionDetails){
    let userRefreshToken = sessionDetails.refreshToken;
    let userIdToken = sessionDetails.idToken;

    return firebaseAdmin.auth().verifyIdToken(userIdToken, true).then(async (decodedToken) => {

        console.log(`Decoded session token is ${JSON.stringify(decodedToken)}`);

        return {
            isValid: true,
            uid: decodedToken.uid,
            fullDecodedToken: decodedToken
        }
    }).catch((error) => {
        if (error.code == 'auth/id-token-revoked') {
            // Token has been revoked. Inform the user to reauthenticate or signOut() the user.
            console.log("You must sign in again to access this. Full error is: \n" + error);
        } else {
            // Token is invalid.
            console.log("Session token is invalid. Full error is: \n" + error);
        }
          
        return {error:error};
    });
}

// This function is using firebase method to delete user in firebase by taking 
// firebase uid or params as the argument value to the function's parameter. 
async function deleteClient(uid){
    let deleteClientResult = firebaseAdmin.auth().deleteUser(uid)
    .then (() => {
        console.log("deletionResult is: ", deleteClientResult)
        console.log(`The user ${uid} has been deleted`)
        return (`The user ${uid} has been deleted`)
    })
    .catch((error) => {
        console.log ("Delete did not work: ", error)
        return {error: error}
    })
    
    return deleteClientResult;
}

// This function is to list all users using firebase method that will return
// the user name and user id(uid)
async function listAllClient(){
    
    // List batch of users, 1000 at a time.
    return firebaseAdmin.auth().listUsers()
        .then((listUsersResult) => {
            // return listUsersResult
            return listUsersResult.users.map ( x => {
                return {displayName: x.displayName || null, uid: x.uid}
            })
      
        })
        .catch((error) => {
        console.log('Error listing users:', error);
        })
}

// This function takes in method from getAuth which is also coming from firebase.
// The purpose of this function is to log out the currently logged-in user.
async function logOut() {
    return getAuth().signOut()
    .then(function() {
        console.log("You've signed out successfully");
        return ("You've signed out successfully")
    }, function(error) {
        console.error('Sign Out Error', error);
        return ('Sign Out Error', error)
    });
}



module.exports = {
    signUpUser, signInUser, validateUserSession, deleteClient, listAllClient, logOut
}