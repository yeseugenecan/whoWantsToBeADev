// HELLLO CAN
// NICE

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

const app = {};

app.level = 0;
app.questions = [];
app.correctAnswers = [];
app.incorrectAnswers = [];
app.randomizedAnswers = [];

app.getQuestions = (difficulty) => {
    return $.ajax({
        url: `https://opentdb.com/api.php?amount=5&category=18&difficulty=${difficulty}&type=multiple`,
        method: `GET`,
        dataType: `json`
    });
}

async function getData() {
    const data = await app.getQuestions('medium');
    const arrayOfQuestions = data.results;
    arrayOfQuestions.forEach((arrayItem) => {
        app.questions.push(arrayItem.question);
        app.correctAnswers.push(arrayItem.correct_answer);
        app.incorrectAnswers.push(arrayItem.incorrect_answers)
    })
    app.loadStartScreen();
    // $("main").on('click', '.begin', function(){
    //     app.loadNextQuestion(app.questions, app.correctAnswers, app.incorrectAnswers);
    //     $(`ul li:nth-child(${app.level})`).css({ "color": "white", "font-size": "1.2rem", "opacity": "1"})
    // })
}

app.randomizeAnswers = (correct, wrongAnswer) => {
    const allAnswers = wrongAnswer.concat(correct);
    return app.shuffle(allAnswers);
}

// from https://bost.ocks.org/mike/shuffle/
app.shuffle = (array) => {
    let m = array.length, t, i;
    // While there remain elements to shuffle…
    while (m) {
        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);
        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
}

app.loadNextQuestion = (question, correct, wrong) =>{
    app.level++;
    let randomized = app.randomizeAnswers(correct[app.level - 1], wrong[app.level-1]);
    let frame = `<h2>${question[app.level - 1]}</h2>
            <form action="">
                <div class="answers">
                    <div class="answer">
                        <input type="radio" id="answer1" name="answers" value="lorem">
                        <label for="answer1">A. <span>${randomized[0]}</span></label>
                    </div>
                    <div class="answer">
                        <input type="radio" id="answer2" name="answers" value="lorem">
                        <label for="answer2">B. <span>${randomized[1]}</span></label>
                    </div>
                    <div class="answer">
                        <input type="radio" id="answer3" name="answers" value="lorem">
                        <label for="answer3">C. <span>${randomized[2]}</span></label>
                    </div>
                    <div class="answer">
                        <input type="radio" id="answer4" name="answers" value="lorem">
                        <label for="answer4">D. <span>${randomized[3]}</span></label>
                    </div>
                </div>
            </form>
            <button>Submit <i class="fas fa-long-arrow-alt-right"></i></button>`
    $('.question').html(frame);
}
app.loadStartScreen = () => {
    // let frame =
    //     `<div class="question">
    //             <h2> Who wants to be a developer</h2>
    //             <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Officia dolores reprehenderit, facere quibusdam nihil modi error quia odio cumque minus!</p>
    //             <button class="begin">Begin</button
    //         </div>`
    // $('main').html(frame);
    $('button').on('click', (e)=> {
        e.preventDefault();
        app.loadNextQuestion(app.questions, app.correctAnswers, app.incorrectAnswers);
        

        

    })
    $('button').text('Begin');
}


app.init = () => {
    getData();
    console.log(app.questions);
}


$(function () {
    app.init();
    console.log(app.questions);

});
