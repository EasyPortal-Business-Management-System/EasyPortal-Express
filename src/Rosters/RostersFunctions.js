const {Post} = require('../database/schemas/PostsSchema');

// Model.find() with no conditions inside "find()" will return all documents of that Model
async function getAllEmployees(){
    let allEmployees = await Post.find();
  
    return {allEmployees: allEmployees}
}



// a function that connects to mongoose method and database to search a specific user by id
async function getSpecificEmployee(postID){
    let specificEmployeeQuery = await Post.findById(postID).exec();
    return specificEmployeeQuery;
}

// A function that creates a new user database in mongoDB. Since the method used isn't 'create', but 'new', then we need to use save method.
async function createSpecificEmployee(postDetails){
    let newPost = new Post({
        name: postDetails.displayName,
        employeeID: postDetails.employeeID,
        WeekPeriod: postDetails.WeekPeriod,
        Monday: postDetails.Monday,
        Tuesday: postDetails.Tuesday,
        Wednesday: postDetails.Wednesday,
        Thursday: postDetails.Thursday,
        Friday: postDetails.Friday,
        Saturday: postDetails.Saturday,
        Sunday: postDetails.Sunday,
        TotalHours: postDetails.TotalHours,
        TotalBreak: postDetails.TotalBreak
    })
    // extra logic can be added here on the newPost before saving. ie. validation.
    // and then save

    let creationResult = await newPost.save();
    return creationResult;
}

// A function to update specific mongoDB user database by its id
async function updateSpecificEmployee(postDetails){
    try {
        let updateResult = await Post.findByIdAndUpdate(
            {_id: postDetails.id},
            {
                WeekPeriod: postDetails.WeekPeriod,
                Monday: postDetails.Monday,
                Tuesday: postDetails.Tuesday,
                Wednesday: postDetails.Wednesday,
                Thursday: postDetails.Thursday,
                Friday: postDetails.Friday,
                Saturday: postDetails.Saturday,
                Sunday: postDetails.Sunday,
                TotalHours: postDetails.TotalHours,
                TotalBreak: postDetails.TotalBreak
            },
            { 
                upsert: true, // upsert means it'll create document if it doesn't exist
                new: true // return the new modified doc. if false, original is returned.
            } 
        );
        console.log("Rosters Function Post details: ", postDetails)
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

// A function that delete a user database in mongoDB using parameter from '_id'. Returns an empty object if all goes well.
async function deleteSpecificEmployee(id){
    let deletionResult = await Post.deleteOne({ _id: id});
    // returns 1 if deleted 1 document
    // returns 0 if deleted 0 documents
    // should never return more than 1
    console.log("MongoDB user deletion result:", deletionResult)
    return deletionResult;
}

module.exports = {
    getAllEmployees, getSpecificEmployee, createSpecificEmployee, updateSpecificEmployee, deleteSpecificEmployee
}