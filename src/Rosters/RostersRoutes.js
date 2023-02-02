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
routes.get('/:employeeID', async (request, response) => {
    // console.log("Rosters Routes GETONE EMPLOYEE Request: ", request.params)
    let singeBlogPost = await getSpecificEmployee(request.params.employeeID);
    response.json(singeBlogPost);


});

// This route is to create a user database in mongoDB
// with default value of baseURL /employees
routes.post('/', async (request, response) => {

    let creationResult = await createSpecificEmployee({
        displayName: request.body.displayName,
        employeeID: request.body.uid,
        WeekPeriod: request.body.WeekPeriod,
        Monday: request.body.Monday,
        Tuesday: request.body.Tuesday,
        Wednesday: request.body.Wednesday,
        Thursday: request.body.Thursday,
        Friday: request.body.Friday,
        Saturday: request.body.Saturday,
        Sunday: request.body.Sunday,
        TotalHours: request.TotalHours,
        TotalBreak: request.TotalBreak

    })
    response.json(creationResult);
});

// This route is to call delete function of user database in mongoDB
routes.delete('/:id', async (request, response) => {
    let deleteResult = await deleteSpecificEmployee(request.params.id);
    response.json(deleteResult);

});


// This route is to call update function user database in mongodb
routes.put('/:id', async (request, response) => {
    
    let updateResult = await updateSpecificEmployee({
        id: request.params.id,
        // displayName: request.body.displayName,
        
        // employeeID: request.body.employeeID,
        WeekPeriod: request.body.WeekPeriod,
        Monday: request.body.Monday,
        Tuesday: request.body.Tuesday,
        Wednesday: request.body.Wednesday,
        Thursday: request.body.Thursday,
        Friday: request.body.Friday,
        Saturday: request.body.Saturday,
        Sunday: request.body.Sunday,
        TotalHours: request.body.TotalHours,
        TotalBreak: request.body.TotalBreak
    });
    // console.log("Rosters Routes Request: ", request)
    // console.log("Rosters Routes Response: ", response)
    console.log("Update request receieved and Updated")
    response.json(updateResult);

});

// Match Firebase user ID to Mongo user ID

routes.get('/match/:user_id', async (request, response) => {
    console.log("Request params: ", request.params)
    let postsResult = await getAllEmployees();

    
    // Find index position of matching Firebase UID against MongoDB user
    const index = postsResult.allEmployees.map(e => e.employeeID).indexOf(request.params.user_id)
    
    console.log(postsResult.allEmployees[index])
    const result = postsResult.allEmployees[index]

    
    response.json(result);


});


module.exports = routes; 