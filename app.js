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
        let temparray = [];
        let num = 0;

        while(temparray.length < 5){
          let mynum = getRandomInt();

          if(temparray.includes(mynum) === true){
            console.log('Duplicate found, try again.');
          }
          else{
            temparray.push(mynum);
            counter.push(mynum);
            tempobj[`${key + num}`] = array[mynum];
            num++;
          }
        }
    console.log(tempobj);
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
            resultobj['img'] = '<img id="resultimg" src="imgs/loss1.jpg">';
        } else if (resultobj.score < 5){
                console.log('Learn 2 google pleb')
                resultobj['verdict'] = 'Learn 2 google you pleb';
                resultobj['img'] = '<img id="resultimg"src="imgs/loss2.jpg">';
        }else {
                console.log('Winrar');
                resultobj['verdict'] = 'It\'s always good to see another patrician.';
                resultobj['img'] = '<img id="resultimg"src="imgs/winrar.jpg">';
        }
    return resultobj;
}

function checkifblank(array){
        console.log(array);
        for(let x = 0; x < 5;x++){
                // if user answer equals ''
                if(array[x] === '' || array[x] === undefined){
                        console.log('Invalid answer!');
                        return false;
                } else{
                        console.log(array[x]);
                        console.log('Answer is valid.');
            }
        }
    return true;
};

// This is only for the answers
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
                    res.render('result', iscorrect(postarray,useranswers));
            }

    });
        return;
}

// Counter that keeps track of what questions were used.
var counter = [];

// Check counter
function checkCounter() {
    if(counter.length === 5){
            console.log('set')
            console.log(counter);
            counter = [];
    }else{
            console.log('Empty!');
    }
}

// GET function for '/home'
app.get("/home", (req, res) => {
    checkCounter();
    neoContent(req, res);
});

app.post('/submit-user-data', function (req, res){
        let useranswers = [req.body.answer1, req.body.answer2, req.body.answer3, req.body.answer4, req.body.answer5];

        if(checkifblank(useranswers)){
                postContent(req, res, useranswers);
        }else{
            res.send('You left an answer blank, midwit');
        };
});

