var mongoose = require('mongoose'); //console.log(mongoose)
mongoose.Promise = global.Promise;
require('dotenv').config()
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true  }).then(()=>{
  console.log("Connected to the Database.");
})
.catch(err => {
  console.log(err);
});
// const db = mongoose.connection;
// db.on('error', function() {
//   console.log('mongoose connection error', error);

// });
// db.once('open', function() {
//   console.log('mongoose connected successfully');
// });



//user schema 
let newsySchema = new mongoose.Schema({
  username: {type:String, required: true, unique:true , timestamps :true},
  email: {type:String, required: true, unique:true},
  password: {type:String, required: true, unique:true},
  posts:[Object],
  savedposts: [Object]
});


//model
let User = mongoose.model('User', newsySchema);

//func to save a user after sign in 
let saveUser = (userInfo) => {  
    var userData = new User({
      username: userInfo.username,
      email: userInfo.email,
      password: userInfo.password,
      posts: [],
      savedposts: []
  });
  return userData.save()
}
// // ----> exemple : 
// saveUser({username:"areen",email:"gmfffail",password:"jkgkjbjb"})


// func to save a post when user posts an article 
let savePosts = (postInfo) => {
   User.updateMany({_id : postInfo.id}, {$push:{posts:postInfo.post}}, (err,data) => {
      if (err) console.log("errr in updatemany in save posts");
      console.log("saved post");
    });
}
// ----> exemple : 
// savePosts({username:"khawla",post: {title:"lalalal", description:"hdvoufeoifpiffp"}})


// func to save post when user saves an article 
let favoritePosts = (postInfo) => {
  User.updateMany({_id: postInfo.id}, {$push: {savedposts:postInfo.savedposts}}, (err,data)=>{
    if (err) console.log("errr in updatemany in save posts");
    console.log("saved posts in favorite");
  });
}
// ----> exemple : 
// favoritePosts({username:"areen", savedposts : {owner: "mohamed",title:"llalalalal", description:"aaaaaaaaaaaaaaaaa"}})

// module.exports.db = db;
module.exports.User = User;
module.exports.saveUser = saveUser;
module.exports.savePosts = savePosts;
module.exports.favoritePosts = favoritePosts;