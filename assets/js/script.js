var highscoreBtn = document.querySelector('#btn-scores');
var timerEl = document.querySelector('#timeLeft');
var testEl = document.querySelector('#test-template');

var test = true;
var score = 0;
var quizQ = {};

var duration = 0;
var elapsed = 0;
var gameInterval;


start();

function start() {
    clearAll();
    restart();

  
    let details = document.createElement('section')
    details.setAttribute('id','details');
    details.textContent = 'You will have 1 minute to complete this quiz, if you do not answer a question correctly you will be deducted 10 seconds, so study hard and prepare!';
    testEl.appendChild(details)
    let startBtn = document.createElement('button');
    startBtn.setAttribute('id', 'startBtn');
    startBtn.setAttribute('class', 'btn')
    startBtn.textContent = 'Ready?';


    testEl.appendChild(startBtn)

    startBtn.addEventListener('click', function() {
        startQuiz(testBank);
        
    })
}

function clearAll(params) {
    testEl.innerHTML = '';
}
function restart(params) {
    var score = 0;
    var duration = 0;
    var elapsed = 0;
}

function startQuiz(quizSet) {
   
    quizQ = questionSt(quizSet);
    

    duration = quizQ.length * 15;

    startGameTimer();
    renderTime();

    serveQuestion(quizQ);
}

function questionSt(arr) {
    
    let randomQ = []

    for (let index = 0; index < arr.length; index++) {
        randomQ.push(arr[index]);
        
    }
    
    return randomQ;
    
}

function serveQuestion() {
   
    elapsed = 0;
   
    if (quizQ.length === 0) {
        endGame();
        return
    }    
    current = quizQ.pop();
    

    clearAll();

    let questionServed = document.createElement('h2');
    

    questionServed.setAttribute("question", current.qTitle);
    questionServed.textContent = current.qTitle;
    testEl.appendChild(questionServed)

    let choices = document.createElement('ul');

    choices.setAttribute('id', 'choices'); 
    testEl.appendChild(choices)
    
    for (let i = 0; i < current.picks.length; i++) {
        let pickList = document.createElement('li')
        pickList.setAttribute('pick-value', current.picks[i]);
        pickList.setAttribute('id', 'questionNum' + i);
        pickList.textContent = current.picks[i];

        choices.appendChild(pickList)
        
    }
    choices.addEventListener('click', function (params) {
        checkAns(current);
    })
}



function checkAns(cur) {
    
    var e = event.target;
    
    if (e.matches('li')) {
        let pickedItem = e.textContent;

        if (pickedItem === cur.ans) {
            console.log('Correct')
            score += duration - elapsed;
        }else {
            console.log('Wrong')
            duration -= 10;
        }
        setTimeout(serveQuestion,500);
    }
}


  

function startTimer(params) {
    clearInterval(gameInterval);
    seconds = duration;
}

function renderTime(params) {
    timerEl.textContent = duration - elapsed;
    if ((duration - elapsed) < 1) {
        endGame();
    }

}

function startGameTimer () {
    
    startTimer();
    gameInterval = setInterval(function(){
        elapsed++;
        renderTime();
    }, 1000)
}

function stopTime(params) {
    
    seconds = 0;
    clearInterval(gameInterval)
}

function endGame(params) {
    
    stopTime();
    clearAll();

    let details = document.createElement('section')
    details.setAttribute('id','details');
    details.textContent = 'You will have 1 minute to complete this quiz, if you do not answer a question correctly you will be deducted 10 seconds, so study hard and prepare!';
    details.textContent = `Your score is ${score}`;

    let again = document.createElement('button');
    again.setAttribute('id', 'startBtn');
    again.setAttribute('class', 'btn')
    again.textContent = 'Play again!';

    let initals = document.createElement("p");

    let initialsLabel = document.createElement("label");
    initialsLabel.setAttribute("for","userInitials");
    initialsLabel.textContent = "Enter Initials: ";

    let initialsInput = document.createElement("input");
    initialsInput.setAttribute("id","userInitials");
    initialsInput.setAttribute("name","userInitials");
    initialsInput.setAttribute("minlength","2");
    initialsInput.setAttribute("maxlength","2");
    initialsInput.setAttribute("size","2");

    testEl.appendChild(details);
    testEl.appendChild(again);
    testEl.appendChild(initals);
    testEl.appendChild(initialsLabel);
    testEl.appendChild(initialsInput);

    again.addEventListener('click', start);

    initialsInput.addEventListener("input", function() {
       
        initialsInput.value = initialsInput.value.toUpperCase();
        if ( initialsInput.value.length === 2 ) { 
    
          //create object for this score
          let thisScore = [ { name: initialsInput.value, score: score } ]; 
    
          //get highscores from memory
          let scores = JSON.parse(localStorage.getItem("highScores")); 
          
    
          if (scores !== null) { 
            scores.push(thisScore[0]); 
          } else {
            scores = thisScore;
          }
    
          localStorage.setItem("highScores", JSON.stringify(scores));
          
          highscores();

        }
      });


}

function highscores(params) {
    
    stopTime();
    clearAll();


    let scores = JSON.parse(localStorage.getItem('highScores'))
    
    let details = document.createElement('h2');
    details.setAttribute('id', 'details');

    details.textContent = 'Top Scores of All Time!';

    testEl.appendChild(details);

    if ( scores !== null ) {
        // sort scores
        scores.sort((a,b) => (a.scores < b.scores) ? 1: -1);

        // sets the number of scores to display to 5 or the number of games played. Which ever is less
        let numScores2Display = 5;
        if ( scores.length < 5 ) { 
            numScores2Display = scores.length; 
        }

        for (var i = 0; i < numScores2Display; i++) {
            var s = scores[i];

            var p = document.createElement("p");
            p.textContent = s.name + " " + s.score;
            testEl.appendChild(p);
        }
        } else {
        var p = document.createElement("p");
        p.textContent =  "Your Initials Here!"
        testEl.appendChild(p);
        }


        // creates button to start the game
        let playAgain = document.createElement("button");
        playAgain.setAttribute("id", "playAgain");
        playAgain.setAttribute("class", "btn btn-secondary");
        playAgain.textContent = "Play!";

        testEl.appendChild(playAgain);

        playAgain.addEventListener("click", start);
}
highscoreBtn.addEventListener("click", highscores);