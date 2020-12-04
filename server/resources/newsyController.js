const { string } = require('@hapi/joi');
const { data, contains } = require('jquery');
var db = require('../db/index.js');
var counter = 0;
//Our Controller methods

exports.addingPost = function(req, res) {
    // console.log("adding post")
    var user_id =req.user;
    // console.log("boiboi",user_id)
    var myPost = req.body.post;
    // console.log("post", myPost )
    
    myPost.id = counter;
    console.log(myPost.id)
    var postobj={id: user_id,
                post : myPost }
    // console.log(postobj)
    db.savePosts(postobj);
     counter ++;
    res.send('hello from saving post');
   
    
}

// home

//this func return all posts of all users for the home page 
exports.retriveAll = function (req, res) {
    console.log("received from proxy ")
db.User.find({}, function(err, data) {
    if(err) {
    res.sendStatus(500);
    } else {
      var data2 = []; 
for (var one=0;one <  data.length; one++){
    for (var i = 0; i < data[one].posts.length; i++){
     data2.unshift({username: data[one].username , post: data[one].posts[i]})
  
  } 
}
     res.json(data2)
     
    }
}) 

}
//home

//this func return all informations about a user 
exports.userProfile = function (req, res) {
    let username = req.user ;
    db.User.find({_id: username}, ((err, data) => {

        var data1 = data[0]
        console.log(username)
        data2 = {
            "_id": data1._id,
            "username": data1.username,
            "email": data1.email ,
             "posts":data1.posts,

        }
        
    res.send(data2);
}))
};
/*
route('/myProfile')
if the client click on his profile he will see his posts
get the (data) user's post by his name
**QUESTION how to know which user?? from route itself i'll send username with it, 
we will use username variable here to send sth with get using route.
*/

// this func adds postes to the favorite of a user (saves a post in savedposts)
exports.savePost = function (req, res) {
    console.log('amallllllll')
    let id= req.body.id
   
    let user_id= req.user
  
    db.User.find({_id:user_id},(err,data)=>{
      
        if(err)
        console.log(err)
    
        let array = data[0].savedposts
        if(!array.length){
            db.User.find({},(err,data)=>{
                for(var i = 0; i < data.length; i++){
                    var posts = data[i].posts  
                    console.log(posts ,"fjk")
                    for(var j = 0; j < posts.length;j++){
                     if(posts[j].id === id){
                    
                     post = posts[j];
                     console.log("post",posts[j])
                     post.username= data[i].username;
                 }
                     
                    }
                }
                 var saveobject={
                   id:user_id,
                   savedposts: post
               }
               console.log(saveobject)
               db.favoritePosts(saveobject);
               })
        }
      for(var i = 0; i< array.length; i++){
          console.log('kwalaaaaaa')
          if (array[i].id !== id){
              
          
            db.User.find({},(err,data)=>{
                for(var i = 0; i < data.length; i++){
                    var posts = data[i].posts  
                    console.log(posts ,"fjk")
                    for(var j = 0; j < posts.length;j++){
                     if(posts[j].id === id){
                    
                     post = posts[j];
                     console.log("post",posts[j])
                     post.username= data[i].username;
                 }
                     
                    }
                }
                 var saveobject={
                   id:user_id,
                   savedposts: post
               }
               console.log(saveobject)
               db.favoritePosts(saveobject);
               })
               break;
          }    
        }  
       res.send("success in save this post!");

      })
     
};
/*
route('/saved')
will save on his username(his username)
it will be post req so it'll post in db his saved item
*/

//this func return the favorite postes(savedposts) of a user 
exports.favorite = function (req , res){
    var user_id = req.user;
    console.log(user_id)
    db.User.find({_id: user_id}, function(err, data) {
        if(err) {
        res.sendStatus(500);
        } else {
            console.log(data[0].username)
              res.json(data[0].savedposts)
    }    
    })
}

//this func will filter according to category required
exports.filter = function (req,res) {
    let category = req.params.category;
    db.User.find({},(err, data)=>{
        if(err)
        res.Status(500).send("no posts found with this category")
        else{
            var data2 = []; 
            
            for (var one=0;one <  data.length; one++){
                var filterPosts=[];
                for (var j = 0; j < data[one].posts.length;j++){
                  console.log(data[one].posts[j])
                if (data[one].posts[j].category === category){
                filterPosts.push(data[one].posts[j])  
               
                }
              

              if(filterPosts.length)
               data2.push({username: data[one].username , post:data[one].posts[j] })
             }}
                 res.json(data2)
        }
    })

    
}
//this func delete a post from user profile
exports.delete = function (req, res) {
    let id= parseInt(req.params.id)
    console.log(id)
    let user_id= req.user
    // console.log(username)
    db.User.find({_id:user_id},(err,data)=>{
        if(err)
        console.log(err)
        console.log(data)
        let array = data[0].posts
      for(var i = 0; i< array.length; i++){
          console.log(typeof id )
          if (array[i].id === id){
              
          array.splice(i,1)
          break;
          }    
        }
        console.log(array)
        db.User.updateMany({_id : user_id}, {$set: {posts: array}}, (err,data)=>{
            if (err) console.log("errr in updatemany in delete post");
            console.log("deleted from profile");
          });
           res.send("deleted")
          
      })
     
}

//this func unsave/ delete a post from favorite 
exports.unsave = function (req, res) {
    let id= parseInt(req.params.id)
   console.log('unsaved')
    let user_id = req.user  
    console.log(user_id)
    db.User.find({_id:user_id},(err,data)=>{
        if(err){
        console.log(err)}
        
        let array = data[0].savedposts
        
      for(var i = 0; i< array.length; i++){
          if (array[i].id === id){
            console.log(array)

          array.splice(i,1)
          console.log(array)
          break;
          }    
        }
        db.User.updateMany({_id:user_id}, {$set: {savedposts:array}}, (err,data)=>{
            if (err) console.log("errr in updatemany in unsave posts");
            console.log("saved posts in favorite");
             res.send("unsaved")
          });
          
      })
     
}

exports.like = function (req, res) {
    let id= req.body.id
    let user_id = req.user  
    // console.log(id)
    var likes;
    var stringg
     let array ;
    db.User.find({},(err,data)=>{
        if(err)
        console.log(err)
        
       
      for (var j = 0; j < data.length; j++){
            array = data[j].posts
            
      for(var i = 0; i< array.length; i++){
          if (array[i].id === id){
            //   console.log(array);
            array[i].likes +=1;
           likes=array[i].likes
             stringg=likes.toString()
            
          break;
          }    
        }
    }
    //  console.log(array);
        db.User.updateOne({_id:user_id}, {$set: {posts:array}}, (err,data)=>{
            if (err) console.log("errr in updatemany in like");
            
          });
           res.send(stringg)
      })
     
}