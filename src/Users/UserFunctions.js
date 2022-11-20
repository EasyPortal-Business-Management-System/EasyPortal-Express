// Firebase Admin SDK was initialized elsewhere, we just need access to its functions.
const firebaseAdmin = require('firebase-admin');

// Set up the Firebase Client SDK
const {firebaseConfig} = require('../../keys/firebaseClientKey');
const firebaseClient = require("firebase/app");
// Add the Firebase products that you want to use
const {getAuth, signInWithEmailAndPassword, deleteUser, signOut} = require ("firebase/auth");
const { request } = require('express');
// Initialize the Firebase Client SDK
firebaseClient.initializeApp(firebaseConfig);


//--------------------------------
// Config above
// Functions below



async function signUpUser(userDetails){
    // Use the Firebase Admin SDK to create the user
    return firebaseAdmin.auth().createUser({
        email: userDetails.email, // User email address.
        emailVerified: true, // Required for fuller user functionality, but a hassle to set up in a short tutorial. Set to false if you do end up configuring email verifications, as the email system will set it to true.
        password: userDetails.password, // password. You'll never see this value even as project admin.
        displayName: userDetails.displayName, // the username
        // photoURL: "", // point to an image file hosted elsewhere
        disabled: false // if a user is banned/usable
    }).then( async (userRecord) => {
        console.log(`\n Raw userRecord is ${JSON.stringify(userRecord)} \n`);
            if (userRecord.email === "employer@admin.com" || userRecord.email === "morgan@admin.com" ) {
                // Set "Custom Claims" on the new user
                let adminClaims = firebaseAdmin.auth().setCustomUserClaims(userRecord.uid, {adminUser: true}).then(() => {
                console.log("You are an admin user");
            });
        } else {
            let defaultUserClaims = firebaseAdmin.auth().setCustomUserClaims(userRecord.uid, {regularUser: true}).then(() => {
                console.log("you are a regular user");
                
            });
        }
        return userRecord;

        
        
    }).catch(error => {
        console.log("Internal sign-up function error is: \n" + error);
        return {error:error};
    });
}

async function signInUser(userDetails){
    const firebaseClientAuth = getAuth();

    let signInResult = signInWithEmailAndPassword(firebaseClientAuth, userDetails.email, userDetails.password)
    .then(async (userCredential) => {

        let userIdToken = await firebaseClientAuth.currentUser.getIdTokenResult(false);

        console.log(`userIdToken obj is\n ${JSON.stringify(userIdToken)}`);

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

async function deleteClient(uid){
    let deleteClientResult = firebaseAdmin.auth().deleteUser(uid)
    .then (() => {
        console.log("deletionResult is: ", deleteClientResult)
        console.log(`The user ${uid} has been deleted`)
    })
    .catch((error) => {
        console.log ("Delete did not work: ", error)
        return {error: error}
    })
    
    return deleteClientResult;
}

// List all users


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

async function logOut() {
    return getAuth().signOut()
    .then(function() {
        console.log('Signed Out');
        return ("You've signed out successfully")
    }, function(error) {
        console.error('Sign Out Error', error);
        return ('Sign Out Error', error)
    });
}



module.exports = {
    signUpUser, signInUser, validateUserSession, deleteClient, listAllClient, logOut
}