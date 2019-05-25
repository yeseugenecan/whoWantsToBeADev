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
// app.loadWidgets and app.loadnextquestion
// 
//

const app = {};

app.level = 0;
app.questions = [];
app.correctAnswers = [];
app.incorrectAnswers = [];
app.randomizedAnswers = [];
app.correctIndex;
app.userAnswer;

app.getQuestions = (difficulty) => {
    return $.ajax({
        url: `https://opentdb.com/api.php?amount=5&category=18&difficulty=${difficulty}&type=multiple`,
        method: `GET`,
        dataType: `json`
    });
}

//this function takes in a the correct answer as well as the array of wrong answers and randomly injects the correct answer on the array of wrong answers.

app.randomizeAnswers = (correct, wrongAnswer) => {
    //app.correctIndex stores the position of the correct answer on the array allAnswers
    app.correctIndex = Math.floor(Math.random() * 4);
    //declare allAnswers initially as a copy of wrongAnswers
    const allAnswers = [...wrongAnswer];
    //inject the correctIndex randomly on allAnswers
    allAnswers.splice(app.correctIndex, 0, correct);
    return allAnswers;
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
        //on user clicking submit,
        $('.question').on('click', '.submit', () => {
            //only if user has selected an answer (ie app.userAnswer is not undefined) reset timer. 
            if (app.userAnswer) {
                clearInterval(timer);
            }
        });
        //when width of the progress bar is zero, clearInterval, completely hide the outer progress bar and push the user to the game over screne.
        if (progressWidth <= 0) {
            clearInterval(timer);
            $('.progressOuter').hide();
            app.gameOver();
        }
    }, 10);
}
//this is a helper function for fifty fifty. It picks two random indices that don't contain the correct answer to remove from the array.
app.indicesToRemove = () => {
    //declare an array of all the possible indices
    let arrayOfIndices = [0, 1, 2, 3];
    //first remove the correctIndex from the array.
    arrayOfIndices.splice(app.correctIndex, 1);
    //then pick a random index and remove it from the array as well.
    let indextoRemove = Math.floor(Math.random() * 3);
    arrayOfIndices.splice(indextoRemove, 1);
    //return the remaining array.
    return arrayOfIndices
}
//this is the fifty fifty lifeline. When user clicks fifty-fifty, it removes two random answers that are not the right answer
app.fiftyFifty = () => {
    $('.widgets').on('click', '.fiftyFifty', () => {
        //call the helper function to pick two indices that will be removed.
        let indicesToRemove = app.indicesToRemove();
        //select the two indicesTo be removed and empty their containers.
        $(`.answer:nth-child(${indicesToRemove[0] + 1})`).empty();
        $(`.answer:nth-child(${indicesToRemove[1] + 1})`).empty();
        
        //once the lifeline has been used, add a class that greys the button out as well as turn off the event listener so the user can't use it again.
        $('.fiftyFifty').addClass('usedLifeline');
        $('.widgets').off('click', '.fiftyFifty');
    })
}

//this is a helper function for both askFriend and askTheAudeince Widgets. This function controls whether the user will be directed to the right answer. 
//between levels 0 and 5, the hint is always correct.
//between levels 5 and 10, the hint is 80% likely to be correct.
//between levels 10 and 15, the hiny is 50% likely to be correct.
app.hintAccuracy = () =>{
    //randomizer is the decision variable that controls whether the user is directed to the right answer.
    let randomizer = Math.random();
    if (app.level < 5) {
        return app.correctIndex;
    } else if (app.level < 10 && randomizer >= .2) {
        return app.correctIndex;
    } else if (app.level >= 10 && randomizer >= .5) {
        return app.correctIndex;
    } else {
        if (app.correctIndex === 0) {
            return app.correctIndex + 1;
        } else {
            return app.correctIndex - 1;
        }
    }
}

//this is the Ask a Friend widget. It creates a pop up that offers the user a hint. Hint accuracy is controlled by the app.hintAccuracy() function.
app.askFriend = () => {
    $('.widgets').on('click', '.askFriend', () => {
        //prevent scrolling when the pop up appears
        $('body').addClass('preventScrolling');
        let hintIndex = app.hintAccuracy();

        //once its decided what the hint will be, it is displayed to the user.
        $('.popup').html(`                
            <div class="takeOver">
                <div class="popupBox">
                    <h4>Message a Friend</h4>
                    <p><span class="friend">Brent: </span>I'm pretty sure that the correct answer is ${app.randomizedAnswers[hintIndex]}.</p>
                    <button class="close">Close</button>
                </div>
            </div>`);
        //once the user is done reading the hint, they click "close" to close the popup. Once the button is clicked, the popup is cleared and the event listener is turned off.
        $('.popup').on('click', '.close', () => {
            $('body').removeClass('preventScrolling');
            $('.popup').empty();
            $('.popup').off('click', '.close')
        });

        //once the lifeline has been used, add a class that greys the button out as well as turn off the event listener so the user can't use it again.
        $('.askFriend').addClass('usedLifeline');
        $('.widgets').off('click', '.askFriend');
    });
}

app.askTheAudience = () => {
    //a helper function to rapidly generate percentages as audience feedback.
    const getRandomArbitrary = (min, max) => {
        return Math.floor(Math.random() * (max - min) + min);
    }

    $('.widgets').on('click', '.askTheAudience', () => {
        //prevent scrolling when the pop up appears
        $('body').addClass('preventScrolling');
        //generate 4 random percentages to be displayed to the user. First percent is limited to 75% so that numbers are more evenly distributed.
        let percent1 = getRandomArbitrary(0, 76);
        let percent2 = getRandomArbitrary(0, 101 - percent1);
        let percent3 = getRandomArbitrary(0, 101 - percent1 - percent2);
        let percent4 = 100 - percent1 - percent2 - percent3;

        //push the percentages to an array called audiencePoll to later on display in the pop up.
        let audiencePoll = [percent1, percent2, percent3, percent4];

        //find what the highest percentage is on the array.
        let maxPercent = Math.max(...audiencePoll);

        //find what index is the maxPercent
        indexOfMax = audiencePoll.indexOf(maxPercent);

        //remove the highest percentage out of the audiencePoll array, to inject it back based on the app.hintAccuracy() outcome. 
        audiencePoll.splice(indexOfMax, 1);

        //based on app.hintAccuracy() outcome, hintIndex contains an index that will contain the highest percentage.
        let hintIndex = app.hintAccuracy();
        
        //maxPercent gets injected back into the hintIndex position.
        audiencePoll.splice(hintIndex, 0, maxPercent);

        //generate the popup html.
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

        //create a graph with 4 bars based on the numbers specified by audiencePoll array. 
        for (i = 0; i < audiencePoll.length; i++) {
            // dividing over maxPercent ensures that largest number always has a width of 100%.
            $(`.bar${i}`).width(`${audiencePoll[i] / maxPercent * 100}%`);
            $(`.bar${i}>p`).html(`${audiencePoll[i]}%`);
        }
        //once the user is done reading the hint, they click "close" to close the popup. Once the button is clicked, the popup is cleared and the event listener is turned off.
        $('.popup').on('click', 'button', () => {
            $('body').removeClass('preventScrolling');
            $('.popup').empty();
            $('.popup').off('click', 'button')
        });

        //once the lifeline has been used, add a class that greys the button out as well as turn off the event listener so the user can't use it again.
        $('.askTheAudience').addClass('usedLifeline');
        $('.widgets').off('click', '.askTheAudience');
    });
}

//when called, loads the game over page.
app.gameOver = () => {
    $('.widgets').empty();
    $('.question').html(`<h2>GAME OVER BRAH!</h2><button class="reset">Play Again</button>`)
    //if .reset is clicked, reset the game 
    app.resetGame();
}
//when called, loads the you won page.
app.youWon = () => {
    $('.widgets').empty();
    $('.question').html(`<h2>Congratulations You Won!</h2><p>Looks like you already are a developer</p><button class="reset">Play Again</button>`)
    //if .reset is clicked, reset the game 
    app.resetGame();
}

//when called activates the event listener to reset the game. 
app.resetGame = () => {
    $('.question').on('click', '.reset', () => {
        //remove all the styling that gives indication of the current question.
        $(`aside li:nth-child(${app.level + 1})`).removeClass('currentQuestion');
        
        //reset all game variables.
        app.level = 0;
        app.questions = [];
        app.correctAnswers = [];
        app.incorrectAnswers = [];
        app.randomizedAnswers = [];
        app.correctIndex = 0;
        
        //take the user back to the start screen and make a new API call.
        app.loadStartScreen();
        app.getData();

        //remove usedLifeLine class from all lifelines so they longer appear greyed out.
        $('.usedLifeline').removeClass('usedLifeline');

        //remove class that hides the logo to display on the start screen.
        $('h1').removeClass("hiddenOnMobile");

        //turn off the event listener for .reset button.
        $('.question').off('click', '.reset');
    })
}

//when called loads the Next Question with all the wid
app.loadNextQuestion = (question, correct, wrong) => {
    
    //first randomly inject the correct answer into the array of randomizedAnswers.
    app.randomizedAnswers = app.randomizeAnswers(correct[app.level], wrong[app.level]);
    
    //generate a timer to be displayed to the user.
    app.makeTimer(10);
    console.log(`correct answer is: ${app.correctAnswers[app.level]}`);
    
    //generate the frame that displays the question along with the answers to the user.
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

    //load the question to the user.
    $('.question').html(frame);
    //iterate the class of currentQuestion on the next list item so that next list item is highlighted.
    $(`aside li:nth-child(${app.level + 1})`).addClass('currentQuestion');
    $(`aside li:nth-child(${app.level})`).removeClass('currentQuestion');

}

// when called loads the start screen.
app.loadStartScreen = () => {
    let frame = `<h2> Who wants to be a developer</h2>
                    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit.Officia dolores reprehenderit, facerequibusdam nihil modi error quia odio cumque minus!</p>
                    <button class="loading">Loading <i class="fas fa-long-arrow-alt-right"></i></button>`
    $('.question').html(frame);
}


// when called loads the widgets bar along with all the individual widget listeners. 
app.loadWidgets = () => {
    $('.widgets').html(`
        <div class="progressOuter">
            <div class="progressInner"></div> 
            <div class="countdown"><p>60</p></div>
        </div>
        <ul class="lifelines">
            <li><button class="fiftyFifty"><i class="fas fa-divide"></i></button></li>
            <li><button class="askTheAudience"><i class="fas fa-chart-bar"></i></button></li>
            <li><button class="askFriend"><i class="far fa-comment"></i></button></li> 
        </ul>
    `)
    //before turning on any widget, make sure all their event listeners are off.
    $('.widgets').off();

    //turn on all the event listeners for all the widgets.
    app.fiftyFifty();
    app.askFriend();
    app.askTheAudience();
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
        $('h1').addClass("hiddenOnMobile");
        e.preventDefault();
        app.loadWidgets();
        app.loadNextQuestion(app.questions, app.correctAnswers, app.incorrectAnswers);
    })
    $('.question').on('click', '.submit', () => {
        app.userAnswer = $("input[name=answers]:checked").val();
        console.log(app.userAnswer);
        if (app.userAnswer) {
            $('.submit').hide();
            $("input[name=answers]:checked ~ label").css('background', 'orange');
            setTimeout(() => {
                if (app.correctIndex === parseInt(app.userAnswer, 10) && app.level === 14) {
                    $("input[name=answers]:checked ~ label").css('background', 'green');
                    setTimeout(app.youWon(), 1000);
                }
                else if (app.correctIndex === parseInt(app.userAnswer, 10)) {
                    $("input[name=answers]:checked ~ label").css('background', 'green');
                    setTimeout(() => {
                        console.log("correct");
                        app.level++;
                        app.loadNextQuestion(app.questions, app.correctAnswers, app.incorrectAnswers)
                    }, 1000);
                }
                else {
                    $("input[name=answers]:checked ~ label").css('background', 'red');
                    setTimeout(() => {
                        $(`.answer:nth-child(${app.correctIndex + 1}) > label`).css('background', 'green');
                        setTimeout(() => { app.gameOver() }, 1000)
                    }, 1000);

                }
            }, 1000);
        }
    })
}



$(function () {
    app.init();
});
