const mongoose = require('mongoose');

// Schema to structure the data, not for authentication but for rosters
const PostSchema = new mongoose.Schema({
    name: String,
    rosters: String,
    employeeID: String
});

PostSchema.methods.getAuthorName = async function getAuthorName() {
    /*
    let author = AuthorSchema.findById(this.postAuthorID)
    */
   console.log(`Use the auth system to search for a user, something like FirebaseAuth.findUser(postAuthorID) using the data value from ${this.employeeID}`)
}

// Class / model Creation (Instantiation) to help make instances of that schema
const Post = mongoose.model('Post', PostSchema);

module.exports = {Post}