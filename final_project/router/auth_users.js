const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
   }
   

const authenticatedUser = (username,password)=>{ //returns boolean
        let validusers = users.filter((user)=>{
          return (user.username === username && user.password === password)
        });
        if(validusers.length > 0){
          return true;
        } else {
          return false;
        }      
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
   
   
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
   
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        user: username
      }, 'access', { expiresIn: 60 * 60 });
   
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
   
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const userReview = req.query.review;
    if(userReview){
        let review = {};
        console.log("review......", review);
        const loggeduser = req.user;
        
        review[loggeduser] = userReview;
        books[isbn].reviews = { ...books[isbn].reviews, ...review} ;
        return res.status(200).json({message: "review has been added/updated"});
    
    }
    else{
        return res.status(400).json({message: "review is missing"}); 
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const loggedUser = req.user;
    if(isbn){
        if(books[isbn]["reviews"][loggedUser]){
        delete books[isbn]["reviews"][loggedUser];
        return res.json({"message": "review is deleted"});
        }
        else{
            return res.json({"message": "you have not given any review for this book."});
        }
        
    }
    else{
        return res.status(400).json({message: "isbn number is missing"});  
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.doesExist = doesExist;
module.exports.users = users;
module.exports.authenticatedUser = authenticatedUser;
