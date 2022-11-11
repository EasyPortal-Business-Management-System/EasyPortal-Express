const {Post} = require('../database/schemas/PostsSchema');

// Model.find() with no conditions inside "find()" will return all documents of that Model
async function getAllEmployees(){
    let allEmployees = await Post.find();
    return JSON.stringify(allEmployees);
}

// The ".exec()" helps the query just run instead of saving it for re-use.
async function getSpecificEmployee(postID){
    let specificEmployeeQuery = await Post.findById(postID).exec();
    return specificEmployeeQuery;
}

// New Post instance needs to be specifically saved for it to be stored in the database.
async function createSpecificEmployee(postDetails){
    let newPost = new Post({
        name: postDetails.name,
        rosters: postDetails.rosters,
        employeeID: postDetails.employeeID
    })
    // extra logic can be added here on the newPost before saving. ie. validation.
    // and then save

    let creationResult = await newPost.save();
    return creationResult;
}

// Theoretically, you could use this instead of "new Post({})" thanks to upsert.
async function updateSpecificEmployee(postDetails){
    try {
        let updateResult = await Post.findByIdAndUpdate(
            {_id: postDetails.postID},
            {
                name: postDetails.name,
                rosters: postDetails.rosters,
                employeeID: postDetails.employeeID
            },
            { 
                upsert: true, // upsert means it'll create document if it doesn't exist
                new: true // return the new modified doc. if false, original is returned.
            } 
        );
    
        return updateResult;
    }
    catch (error) {
        if (error.name == "CastError") {
            return {
                errorCode: "Document not found"
            }
        }
        return {
            error: error,
            errorCode: "Failed to update document"
        }

    }

    
}

// Returns an empty object if all goes well.
async function deleteSpecificEmployee(postID){
    let deletionResult = await Post.deleteOne({ _id: postID});
    // returns 1 if deleted 1 document
    // returns 0 if deleted 0 documents
    // should never return more than 1
    return deletionResult;
}

module.exports = {
    getAllEmployees, getSpecificEmployee, createSpecificEmployee, updateSpecificEmployee, deleteSpecificEmployee
}