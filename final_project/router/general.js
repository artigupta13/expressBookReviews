const express = require('express');
let books = require("./booksdb.js");
let doesExist = require("./auth_users.js").doesExist;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const jwt = require('jsonwebtoken');


public_users.post("/register", (req,res) => {
    let authorization = {};
    req.session = authorization;
    const username = req.body.username;
    const password = req.body.password;
   
    if (username && password) {
      if (!doesExist(username)) {
        users.push({"username":username,"password":password});
        let accessToken = jwt.sign({
          user: username
        },'access',{expiresIn: 60*60});
        req.session.authorization = {
          accessToken,username
        }
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});   
      }
    }
    return res.status(404).json({message: "Unable to register user."});   
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify({books},null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if(isbn){
        const book = books[isbn];
        if(book){
            res.send(JSON.stringify({book},null,4));
        }
        else{
            res.status(404).json({"message": "unable to find book!"});
        }
    }
    else{
        return res.status(300).json({message: "isbn number is missing in the request"});
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const authors = [];
    if(author){
        for (key in books){
            if(books[key].author === author){
                authors.push(books[key])
            }
        }

        if(authors.length > 0){
            return res.send(JSON.stringify({"books": authors},null,4));
        }
        else{
            res.status(404).json({"message": "unable to find book!"});
        }
    }
    else{
        return res.status(300).json({message: "author name is missing in the request"});
    }

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const titles = [];
    if(title){
        for (key in books){
            if(books[key].title === title){
                titles.push(books[key])
            }
        }

        if(titles.length > 0){
            return res.send(JSON.stringify({"books": titles},null,4));
        }
        else{
            res.status(404).json({"message": "unable to find book!"});
        }
    }
    else{
        return res.status(300).json({message: "title is missing in the request"});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
   const isbn = req.params.isbn;
    if(isbn){
        const reviews = books[isbn].reviews;
            res.send(JSON.stringify({reviews},null,4));
    }
    else{
        return res.status(300).json({message: "isbn number is missing in the request"});
    }
});

module.exports.general = public_users;
