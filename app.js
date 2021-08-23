// Import sqlite3
const sqlite3 = require('sqlite3').verbose();

// Connect to db & check for errors!
let db = new sqlite3.Database('db/database.db', sqlite3.OPEN_READWRITE, (err) => {
    if(err){
            return console.log(err);
    }
    console.log('Connected to the local SQLite database.');
});

// Import express module
const express = require("express");
const app = express();

// Set ejs
app.set('view engine', 'ejs')


// Define port which application is running off
const port = 9999;

// body-parser
let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false}));

// Set the middleware (css, imgs, and extra js)
app.use(express.static(__dirname + '/src')); 

// Quiz Homepage

app.get("/home", (req, res) => {
        res.render('home', {name:'Antonio'});
});


// Port listener
app.listen(port);

// Here goes the post that handles data

app.post('/submit-user-data', function (req, res){
        
        // There should be a function that checks whether or not the user filled out all the questions.

        let useranswers = [req.body.answer1, req.body.answer2, req.body.answer3, req.body.answer4, req.body.answer5];
        
        useranswers.forEach((x) => {
                console.log(x);
        });
        
        res.send('Answers submitted successfully.');
        
        /*
        // Here be the redirect for the results page
        res.redirect('back');
        */
});

// Here be middleware!

function getRandomInt(){
        min = Math.ceil(1);
        max = Math.floor(10);
        return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getQuestions(){
        let questions = [];
        

        for(let i = 0; i < 5; i++){
               questions.push(db.get(`select question from questions where id = ${getRandomInt()}`, (err, row) => {
                        if(error){
                                return console.error(err.message);
                        }
                        return row
                }));
        }
        return questions;
};

function isRight(array, usranswers){
        let score = 0;
        for(let i = 0; i < 5;i++){
                if(db.get(`select answer from questions where question = ${array[i]}`) === useranswer[i]){
                      score++;
                    } else{
                            console.log('You\'re wrong!');
                    }
        };
        return score;
}



