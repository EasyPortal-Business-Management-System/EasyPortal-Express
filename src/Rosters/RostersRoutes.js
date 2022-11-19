const express = require('express'); // express provides framework to the router. 

// Create a bundle of routes. We'll export this out and then import it into src/index.js.
const routes = express.Router();


const { getAllEmployees, getSpecificEmployee, createSpecificEmployee, updateSpecificEmployee, deleteSpecificEmployee } = require('./RostersFunctions')


// This is the "root" route for the Router instance. 
// Its actual name in the URL will depend on how it's configured in src/index.js
//localhost:55000/Bananas/blaa -> so the endpoint of routers get would after bananas/
routes.get('/', async (request, response) => {

    let postsResult = await getAllEmployees();

    response.json(postsResult);

    
    // response.json({
    //    "message": `Received a request on ${request.originalUrl}`
    // })
    
});

// Set up route params with the colon before the name.
routes.get('/:employeeID/', async (request, response) => {
    
    let singeBlogPost = await getSpecificEmployee(request.params.employeeID);
    response.json(singeBlogPost);

    // // Nested params just get pushed up to request.params! :D 
    // console.log(request.params);
    // response.json(`Received a GET request for a blog post with ID of ${request.params.blogID} and nested param of ${request.params.AnotherParam}`);

});

// Use Postman or another HTTP tool to visit a POST route.
routes.post('/', async (request, response) => {

    let creationResult = await createSpecificEmployee({
        displayName: request.body.displayName,
        rosters: request.body.rosters,
        employeeID: request.body.employeeID
    })
    response.json(creationResult);

    // console.log(`Content author was ${request.body.postAuthorID}`);

    // response.json( {
    //     message : `Received a POST request for a blog post with ID of ${request.params.blogID}`,
    //     bodyContent: request.body
    // });
});

routes.delete('/:postID', async (request, response) => {
    let deleteResult = await deleteSpecificEmployee(request.params.postID);
    response.json(deleteResult);

});

routes.put('/:postID', async (request, response) => {
    let updateResult = await updateSpecificEmployee({
        postID: request.params.postID,
        displayName: request.body.displayName,
        rosters: request.body.rosters,
        employeeID: request.body.employeeID
    });

    response.json(updateResult);

});

module.exports = routes; 