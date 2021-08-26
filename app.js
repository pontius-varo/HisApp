// Import sqlite3
const sqlite3 = require('sqlite3').verbose();

// Connect to db
let db = new sqlite3.Database('./db/database.db');

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

// Below is everything used for '/home'

function getRandomInt(){
        min = Math.ceil(0);
        max = Math.floor(9);
        return Math.floor(Math.random() * (max - min + 1)) + min;
}

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
                    console.log(data)
                    let neoarray = [];
                    data.forEach(function(item) {
                            var x = item.question;
                            console.log(x);
                            neoarray.push(x);
                    });                    
                    //console.log(addtoDoc(neoarray, 'qst'));
                    res.render('home', addtoDoc(neoarray, 'qst'));
                } 
        });
    return;
};

//functions for results page

function iscorrect(answers, useranswers){
        let resultobj = {score: 0};
        for(let x = 0; x < 5; x++){
            if(answers[x] === useranswers[x]){
                console.log('Correct');
                resultobj.score += 1;
            }else{
                    console.log('Incorrect');
            }
        }

        if(resultobj.score < 2){
            console.log('GET GUD');
            resultobj['verdict'] = 'Get Gud';
        } else if (resultobj.score < 5){
                console.log('Learn 2 google pleb')
                resultobj['verdict'] = 'Learn to Google midwit';
        }else {
                console.log('Winrar');
                resultobj['verdict'] = 'A fellow man of culture I see.';
        }
    return resultobj;
}

function checkifblank(array){
        for(let x = 0; x < 5;x++){
                // if user answer equals ''
                if(array[x] === '' || undefined){
                        console.log('Invalid answer!');
                        return false;
                } else{
                        console.log('Answer is valid.'); 
            }
        }
    return true;
};

let postContent = (req, res, useranswers) => {
    db.all('select id, answer from questions', function(err, data) {
            if(err){
                    console.log(err);
            }else{
                    let postarray = [];
                    
                    for(let x = 0; x < 5;x++){
                        console.log(data[counter[x]].answer);
                        postarray.push(data[counter[x]].answer);
                    }
                    //console.log(postarray);
                    //console.log(iscorrect(postarray, useranswers));
                    //res.send('Kek');
                    res.render('result', iscorrect(postarray,useranswers));
            }

    });
        return;
}

// Counter that keeps track of what questions were used.
var counter = [];

// GET function for '/home'
app.get("/home", (req, res) => {
    neoContent(req, res);
    setTimeout(() => {console.log(counter);}, 5000);
});

app.post('/submit-user-data', function (req, res){

        let useranswers = [req.body.answer1, req.body.answer2, req.body.answer3, req.body.answer4, req.body.answer5];
        
        useranswers.forEach((x) => {
                console.log(x);
        });
        
        if(checkifblank(useranswers)){
                postContent(req, res, useranswers);
        }else{
            res.send('You left an answer blank, midwit');
        };
});
