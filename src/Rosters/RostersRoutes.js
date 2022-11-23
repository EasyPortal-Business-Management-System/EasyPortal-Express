const express = require('express'); // express provides framework to the router. 

// Create a bundle of routes. We'll export this out and then import it into src/index.js.
const routes = express.Router();


const { getAllEmployees, getSpecificEmployee, createSpecificEmployee, updateSpecificEmployee, deleteSpecificEmployee } = require('./RostersFunctions')


// This is the "root" route for the Router instance. 
// Default value is /employees, which is been set up in server.js line 92 - 96.
// The purpose
routes.get('/', async (request, response) => {
    let postsResult = await getAllEmployees();

    response.json(postsResult);    
});

// Set up route params with the colon before the name.
// This route is to implement the get specific user database in mongoDB using params
routes.get('/:employeeID/', async (request, response) => {
    
    let singeBlogPost = await getSpecificEmployee(request.params.employeeID);
    response.json(singeBlogPost);


});

// This route is to create a user database in mongoDB
// with default value of baseURL /employees
routes.post('/', async (request, response) => {

    let creationResult = await createSpecificEmployee({
        displayName: request.body.displayName,
        employeeID: request.body.uid,
        Monday: request.body.Monday,
        Tuesday: request.body.Tuesday,
        Wednesday: request.body.Wednesday,
        Thursday: request.body.Thursday,
        Friday: request.body.Friday,
        Saturday: request.body.Saturday,
        Sunday: request.body.Sunday
    })
    response.json(creationResult);
});

// This route is to call delete function of user database in mongoDB
routes.delete('/:postID', async (request, response) => {
    let deleteResult = await deleteSpecificEmployee(request.params.postID);
    response.json(deleteResult);

});


// This rout is to call update function user database in mongodb
routes.put('/:postID', async (request, response) => {
    let updateResult = await updateSpecificEmployee({
        postID: request.params.postID,
        displayName: request.body.displayName,
        
        employeeID: request.body.employeeID,
        Monday: request.body.Monday,
        Tuesday: request.body.Tuesday,
        Wednesday: request.body.Wednesday,
        Thursday: request.body.Thursday,
        Friday: request.body.Friday,
        Saturday: request.body.Saturday,
        Sunday: request.body.Sunday       
    });

    response.json(updateResult);

});

module.exports = routes; 