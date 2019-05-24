// create an object called theGame
// Make 3 different API calls to fetch 15 questions in varying difficulties.
// Store these questions in an array of objects.


// const displayQuestion = function (question) {
//     correctAnswer = question.correct_answer;
//     incorrectAnswer = question.incorrect_answers;

//     const randomize = function (correctAnswer, incorrectAnswer) {
//         //do stuff to randomnize

//         return arrayOfRandomnizedAnswers
//     }
// }

// When user clicks start, display the first question using the displayQuestion function shown above.

// if user selects the right answer that matches the correctAnswer then show that they are correct and proceed to the next question

// if user selects a wrong answer, then show the correct answer and display game over and their final score.


// Document Ready
// App.init
// App.getdata
// App.loadstartbutton
// app.loadwidget and app.loadnextquestion
// 
//

const app = {};

app.level = 0;
app.questions = [];
app.correctAnswers = [];
app.incorrectAnswers = [];
app.randomizedAnswers = [];
app.randomIndex;

app.getQuestions = (difficulty) => {
    return $.ajax({
        url: `https://opentdb.com/api.php?amount=5&category=18&difficulty=${difficulty}&type=multiple`,
        method: `GET`,
        dataType: `json`
    });
}
app.randomizeAnswers = (correct, wrongAnswer) => {
    app.randomIndex = Math.floor(Math.random() * 4);
    const allAnswers = wrongAnswer;
    allAnswers.splice(app.randomIndex, 0, correct);
    return allAnswers;
}

// from https://bost.ocks.org/mike/shuffle/
// app.shuffle = (array) => {
//     let m = array.length, t, i;
//     // While there remain elements to shuffle…
//     while (m) {
//         // Pick a remaining element…
//         i = Math.floor(Math.random() * m--);
//         // And swap it with the current element.
//         t = array[m];
//         array[m] = array[i];
//         array[i] = t;
//     }
//     return array;
// }

app.loadNextQuestion = (question, correct, wrong) => {
    app.randomizedAnswers = app.randomizeAnswers(correct[app.level], wrong[app.level]);
    app.makeTimer(100);
    console.log(`correct answer is: ${app.correctAnswers[app.level]}`);
    let frame = `<h2>${question[app.level]}</h2>
            <form action="">
                <div class="answers">
                    <div class="answer">
                        <input type="radio" id="answer1" name="answers" value="0">
                        <label for="answer1">A. <span>${app.randomizedAnswers[0]}</span></label>
                    </div>
                    <div class="answer">
                        <input type="radio" id="answer2" name="answers" value="1">
                        <label for="answer2">B. <span>${app.randomizedAnswers[1]}</span></label>
                    </div>
                    <div class="answer">
                        <input type="radio" id="answer3" name="answers" value="2">
                        <label for="answer3">C. <span>${app.randomizedAnswers[2]}</span></label>
                    </div>
                    <div class="answer">
                        <input type="radio" id="answer4" name="answers" value="3">
                        <label for="answer4">D. <span>${app.randomizedAnswers[3]}</span></label>
                    </div>
                </div>
            </form>
            <button class="submit">Submit <i class="fas fa-long-arrow-alt-right"></i></button>`
    $('.question').html(frame);
    $(`ul li:nth-child(${app.level + 1})`).addClass('currentQuestion');
    $(`ul li:nth-child(${app.level})`).removeClass('currentQuestion');
    
}


app.gameOver = () => {
    $('.widgets').empty();
    $('.question').html(`<h2>GAME OVER BRAH!</h2><button class="reset">Play Again</button>`)
    app.resetGame();
}

app.resetGame = () => {
    $('.question').on('click', '.reset', () => {
        $(`ul li:nth-child(${app.level+1})`).removeClass('currentQuestion');
        app.level = 0;
        app.questions = [];
        app.correctAnswers = [];
        app.incorrectAnswers = [];
        app.randomizedAnswers = [];
        app.randomIndex = 0;
        app.loadStartScreen();
        app.getData();
        app.fiftyFifty();
        app.messageFriend();
        app.askTheAudience();
        $('.usedLifeline').removeClass('usedLifeline');
        $('.question').off('click', '.reset');

    })
}
app.loadStartScreen = () =>{
    let frame =    `<h2> Who wants to be a developer</h2>
                    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit.Officia dolores reprehenderit, facerequibusdam nihil modi error quia odio cumque minus!</p>
                    <button class="loading">Loading <i class="fas fa-long-arrow-alt-right"></i></button>`
    $('.question').html(frame);
}

app.youWon = () => {
    $('.widgets').hide();
    $('.question').html(`<h2>Congratulations You Won!</h2><p>Looks like you already are a developer</p><button class="reset">Play Again</button>`)
    app.resetGame();
}

app.makeTimer = (timeLeft) => {

    //declare jquery selectors for better performance
    $countdown = $(".countdown");
    $progressBar = $(".progressInner");

    //display the initial time remaining on page
    $countdown.html(`<p>${timeLeft}</p>`);
    //define the width of the initial progress bar as 100;
    let progressWidth = 100;
    //set the width increment as a function of timeLeft.
    let widthIncrement = progressWidth / timeLeft / 100
    //define the setInterval function
    let timer = setInterval(function () {
        //reduce timeLeft in 0.01 second increments.
        timeLeft = timeLeft - 1 / 100;
        //reduce the width of the progress bar the size of the widthIncrement
        progressWidth = progressWidth - widthIncrement;
        //display timeLeft on the html
        $countdown.html(`<p>${Math.round(timeLeft)}</p>`);
        ///update the width of the progress bar on html
        $progressBar.width(`${progressWidth}%`);
        //when timeLeft is less than 1 second, make seconds singular ie. second
        if (timeLeft < 10) {
            $countdown.html(`<p>${Math.round(timeLeft * 10) / 10}</p>`);
        }
        $('.question').on('click', '.submit', () => {
            clearInterval(timer);
        });
        //when width of the progress bar is zero, clearInterval and move to the next frame.
        if (progressWidth <= 0) {
            clearInterval(timer);
            $('.progressOuter').hide();
            app.gameOver();
            // numberGame.makeFrameTwo();
        }
    }, 10);
}

app.loadWidget = () => {
    $('.widgets').html(`
        <div class="progressOuter">
            <div class="progressInner"></div> 
            <div class="countdown"><p>60</p></div>
        </div>
        <ul class="lifelines">
            <li><button class="fiftyFifty"><i class="fas fa-divide"></i></button></li>
            <li><button class="askTheAudience"><i class="fas fa-chart-bar"></i></button></li>
            <li><button class="messageFriend"><i class="far fa-comment"></i></button></li> 
        </ul>
    `)
}

//this is a helper function for fifty fifty. It picks two random indices that don't contain the correct answer to remove.
app.indicesToRemove = () => {
    let dummyArray = [0,1,2,3];
    var correctIndex = dummyArray.indexOf(app.randomIndex);
    dummyArray.splice(correctIndex, 1);
    let indextoRemove = Math.floor(Math.random() * 3);
    dummyArray.splice(indextoRemove, 1);
    return dummyArray
}
app.fiftyFifty = () =>{
    $('.widgets').on('click', '.fiftyFifty', ()=>{
        let indicesToRemove = app.indicesToRemove();
        console.log(indicesToRemove)
        $(`.answer:nth-child(${indicesToRemove[0]+1})`).empty();
        $(`.answer:nth-child(${indicesToRemove[1]+1})`).empty();
        $('.fiftyFifty').addClass('usedLifeline');
        $('.widgets').off('click', '.fiftyFifty');
    })
}
app.messageFriend = () =>{
    $('.widgets').on('click', '.messageFriend', () => {
        let randomizer = Math.random();
        let hintIndex = 0;
        if(app.level < 5) {
            hintIndex = app.randomIndex;
        } else if(app.level < 10 && randomizer >= .2) {
            hintIndex = app.randomIndex;
        }  else if(app.level >= 10 && randomizer >= .5){
            hintIndex = app.randomIndex;
        } else {
            if (app.randomIndex === 0) {
                hintIndex = app.randomIndex + 1;
            } else {
                hintIndex = app.randomIndex - 1;
            }
        }
        $('.popup').html(`                
            <div class="takeOver">
                <div class="popupBox">
                    <h4>Message a Friend</h4>
                    <p><span class="friend">Brent: </span>I'm pretty sure that the correct answer is ${app.randomizedAnswers[hintIndex]}.</p>
                    <button>Close</button>
                </div>
            </div>`);
        $('.popup').on('click', 'button', () => {
            $('.popup').empty();
            $('.popup').off('click', 'button')
        });
        $('.messageFriend').addClass('usedLifeline');
        $('.widgets').off('click', '.messageFriend');
    });
}
app.askTheAudience = () => {
    const getRandomArbitrary = (min, max) => {
        return Math.floor(Math.random() * (max - min) + min);
    }
    $('.widgets').on('click', '.askTheAudience', () => {
        let randomizer = Math.random();
        let percent1 = getRandomArbitrary(0, 76);
        let percent2 = getRandomArbitrary(0, 101-percent1);
        let percent3 = getRandomArbitrary(0, 101-percent1-percent2);
        let percent4 = 100-percent1-percent2-percent3;
        console.log(percent1, percent2, percent3, percent4);

        let audiencePoll = [percent1, percent2, percent3, percent4];
        let maxPercent = Math.max(...audiencePoll);
        indexOfMax = audiencePoll.indexOf(maxPercent);
        audiencePoll.splice(indexOfMax,1);
        console.log(audiencePoll);

        if (app.level < 5) {
            hintIndex = app.randomIndex;
        } else if (app.level < 10 && randomizer >= .2) {
            hintIndex = app.randomIndex;
        } else if (app.level >= 10 && randomizer >= .5) {
            hintIndex = app.randomIndex;
        } else {
            if (app.randomIndex === 0) {
                hintIndex = app.randomIndex + 1;
            } else {
                hintIndex = app.randomIndex - 1;
            }
        }
        audiencePoll.splice(hintIndex, 0, maxPercent);
        console.log(audiencePoll);

        $('.popup').html(`                
            <div class="takeOver">
                <div class="popupBox audienceChart">
                    <h4>Ask the Audience</h4>
                    <div class="chartContainer">
                        <div class="bar0 bar"><p>A</p></div>
                        <div class="bar1 bar"><p>B</p></div>
                        <div class="bar2 bar"><p>C</p></div>
                        <div class="bar3 bar"><p>D</p></div>
                    </div>
                    <button>Close</button>
                </div>
            </div>`);
        for(i=0; i<audiencePoll.length; i++){
            $(`.bar${i}`).width(`${audiencePoll[i]/maxPercent*100}%`);
            $(`.bar${i}>p`).html(`${audiencePoll[i]}%`);
        }
        $('.popup').on('click', 'button', () => {
            $('.popup').empty();
            $('.popup').off('click', 'button')
        });
        $('.askTheAudience').addClass('usedLifeline');
        $('.widgets').off('click', '.askTheAudience');
    });
}


app.getData = async function () {
    console.log("-------------START OF A NEW ATTEMPT----------");
    const easyQuestions = await app.getQuestions('easy');
    const mediumQuestions = await app.getQuestions('medium');
    const hardQuestions = await app.getQuestions('hard');
    const arrayOfQuestions = ((easyQuestions.results).concat(mediumQuestions.results)).concat(hardQuestions.results);
    arrayOfQuestions.forEach((arrayItem) => {
        app.questions.push(arrayItem.question);
        app.correctAnswers.push(arrayItem.correct_answer);
        app.incorrectAnswers.push(arrayItem.incorrect_answers);
    })
    // console.log(app.questions);
    $('.loading').html('Begin <i class="fas fa-long-arrow-alt-right"></i>').removeClass('loading').addClass('begin');

}

app.init = () => {
    app.getData();
    $('.question').on('click', '.begin', (e) => {
        e.preventDefault();
        app.loadWidget();
        app.loadNextQuestion(app.questions, app.correctAnswers, app.incorrectAnswers);
    })
    $('.question').on('click', '.submit', () => {
        let userAnswer = $("input[name=answers]:checked").val();
        if(app.randomIndex === parseInt(userAnswer, 10) && app.level === 14){
            app.youWon();
        }
        else if (app.randomIndex === parseInt(userAnswer, 10)) {
            console.log("correct");
            app.level++;
            app.loadNextQuestion(app.questions, app.correctAnswers, app.incorrectAnswers);
        }
        else {
            app.gameOver();
        }
    })
    app.fiftyFifty();
    app.messageFriend();
    app.askTheAudience();
}



$(function () {
    app.init();
});
