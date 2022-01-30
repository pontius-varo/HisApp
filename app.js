// Import sqlite3
const sqlite3 = require('sqlite3').verbose();

// Connect to db
let db = new sqlite3.Database('./db/database');

// Import express module
const express = require("express");
const app = express();

// Set ejs
app.set('view engine', 'ejs')

// Define port which application is running off
const port = 2551;

// body-parser
let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false}));

// Set the middleware (css, imgs, and extra js)
app.use(express.static(__dirname + '/src'));

// Port listener
app.listen(port);

console.log(`Server listening on port ${port}`)
// Below is everything used for '/home'

// GET function for '/home'
app.get("/", (req, res) => {
   res.send({status: "OK"})
});

/* Utiliy Functions */
function getRandomInt(length){
         min = Math.ceil(0);
         max = Math.floor(length);
         return Math.floor(Math.random() * (max - min) + min);
}

/* Functions for initial questions */

// The idea here, for hisapp base, is that an object is returned from the db, which is then
// iterated through by getRandomQuestions to create another object of random data.
// It is then passed through the template engine and rendered on the client's end, outlined
// on a POST forum. On submission, the ID of each question is passed with the answer provided
// by the user. That ID is taken and used to get the corresponding answer, which is then compared
// to the User's answer and if it is correct, points are added. Else nothing changes.
// Once the amount of points are calculated, the server responds with a page informing the user
// of their score and presenting them the option to return to the main hisapp page.

/* Returns DB rows */
async function queryQuestions(){
  try{
    const questions = await new Promise((resolve, reject) => {
      db.all('select * from questions', [], (err, data) =>{
        if(err){
          reject(err);
        }
        resolve(data);
      });
    });
    return questions
  }catch (err){
    return err.message;
  }
 }

/* Functions for /hisapp */
function randomQuestions(allquestions){
    random_questions = []

    function randomQuestion(object){
      // return a random interger based on the parent object length
      let num = getRandomInt(object.length)

      // if object[num] already in random_questions
      if(random_questions.includes(object[num])){
        // Run the function again
        return randomQuestion(object)
      }else{
        // Else, return object[num] (since there is no duplicate)
        return object[num]
      }
    }

    // obtain 5 random questions
    for(let i = 0; i < 5;i++){
      random_questions.push(randomQuestion(allquestions))
    }

    // return to the user
    return random_questions
}

/* Functions for /submit-user-data */
function compareAnswers(keys, userobject, mainobject){
  let score = 0

  function get_result_object(result){
    if(result < 2){
      return {score: result, verdict: 'Get Gud', image: 'imgs/loss1.jpg'}
    }else if(result < 5){
      return {score: result, verdict: 'Learn 2 Google, Pleb', image: 'imgs/loss2.jpg'}
    }else{
      return {score: result, verdict: 'You sir, are a gentleman and a scholar.', image: 'imgs/winrar.jpg'}
    }
  }
  // for each answer id
  for(key in keys){
    // interate through all questions
    for(x in mainobject){
      // if answer id is equal to question id
      if(keys[key] == mainobject[x].id.toString()){
        // if user answer is equal to question answer
        if(userobject[keys[key]].toUpperCase() == mainobject[x].answer.toUpperCase()){
          console.log('Correct!')
          // Add a point to the total score
          score = score + 1
        }else{
          // Do nothing since incorrect
          console.log('Incorrect lol')
        }
      }
    }
  }

  return get_result_object(score)
}

/* Requests */

app.get("/hisapp", (req, res) => {
  queryQuestions().then(vanilla_questions => {
    // returns five random questions
    let questions = randomQuestions(vanilla_questions)
    // pass 'questions' to 'home' view and render them
    res.render('home', {questions: questions})
  });
});

app.post('/submit-user-data', function (req, res){
  queryQuestions().then(vanilla_questions => {
    let answer_ids = Object.keys(req.body);

    let results = compareAnswers(answer_ids, req.body, vanilla_questions)

    res.render('result', {result: results})
  })
});
