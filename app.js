// Import sqlite3
const sqlite3 = require('sqlite3').verbose();

// Connect to db & check for errors!
let db = new sqlite3.Database('./db/database.db');

/*
        , sqlite3.OPEN_READONLY, (err) => {
    if(err){
            return console.log(err);
    }
    console.log('Connected to the local SQLite database.');
});
*/

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

// Port listener
app.listen(port);

// Here goes the post that handles data

app.post('/submit-user-data', function (req, res, next){
        
        // There should be a function that checks whether or not the user filled out all the questions.

        let useranswers = [req.body.answer1, req.body.answer2, req.body.answer3, req.body.answer4, req.body.answer5];
        
        useranswers.forEach((x) => {
                console.log(x);
        });
        
        if(checkifblank(useranswers)){
               // res.redirect('results');
                res.send('yeah whatever m8');
        }else{
            req.session.error = 'An error occured. Did you leave one of the spaces blank?';
            return res.redirect('home');
        };
    //Send to results page
});


// Below is everything used for '/home'

function getRandomInt(){
        min = Math.ceil(0);
        max = Math.floor(9);
        return Math.floor(Math.random() * (max - min + 1)) + min;
}

var counter = [];

let addtoDoc = (array, key) => {
        let tempobj = {};
        
        for(let y = 0; y < 5;y++){
            let mynum = getRandomInt();
            counter.push(`${mynum}`);
            tempobj[`${key + y}`] = array[mynum];
        };
        return tempobj;
};


let neoContent = (req, res) => {
        db.all('select question from questions', function(err, data){
            if(err){
                    console.log(err);
            }else{
                    let neoarray = [];
                    data.forEach(function(item) {
                            var x = item.question;
                            //console.log(x);
                            neoarray.push(x);
                    });                    
                    //console.log(addtoDoc(neoarray, 'qst'));
                    res.render('home', addtoDoc(neoarray, 'qst'));
                } 
        });
    return;
};

function checkifblank(array){
        for(let x = 0; x < 5;x++){
                // if user answer equals ''
                if(array[x] === '' || undefined){
                        return false;
                } else{
                        console.log('Answer is valid.'); }
        }
    return true;
};

// GET function for '/home'
app.get("/home", (req, res) => {
    neoContent(req, res);
    setTimeout(() => {console.log(counter);}, 5000);
});

