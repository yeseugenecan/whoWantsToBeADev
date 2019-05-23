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

app.getData = async function() {
    const data = await app.getQuestions('medium');
    const arrayOfQuestions = data.results;
    arrayOfQuestions.forEach((arrayItem) => {
        app.questions.push(arrayItem.question);
        app.correctAnswers.push(arrayItem.correct_answer);
        app.incorrectAnswers.push(arrayItem.incorrect_answers);
    })
    app.loadStartButton();
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
    let randomized = app.randomizeAnswers(correct[app.level - 1], wrong[app.level-1]);
    let frame = `<h2>${question[app.level - 1]}</h2>
            <form action="">
                <div class="answers">
                    <div class="answer">
                        <input type="radio" id="answer1" name="answers" value="${randomized[0]}">
                        <label for="answer1">A. <span>${randomized[0]}</span></label>
                    </div>
                    <div class="answer">
                        <input type="radio" id="answer2" name="answers" value="${randomized[1]}">
                        <label for="answer2">B. <span>${randomized[1]}</span></label>
                    </div>
                    <div class="answer">
                        <input type="radio" id="answer3" name="answers" value="${randomized[2]}">
                        <label for="answer3">C. <span>${randomized[2]}</span></label>
                    </div>
                    <div class="answer">
                        <input type="radio" id="answer4" name="answers" value="${randomized[3]}">
                        <label for="answer4">D. <span>${randomized[3]}</span></label>
                    </div>
                </div>
            </form>
            <button>Submit <i class="fas fa-long-arrow-alt-right"></i></button>`
    $('.question').html(frame);
    app.level++;
}
app.verifyAnswer = () =>{
    $('button').on('click')
    let userAnswer = $("input[name=answers]:checked").val();
    console.log(userAnswer);

}

app.loadStartButton = () => {
    $('button').html('Begin <i class="fas fa-long-arrow-alt-right"></i>').toggleClass('loading');
    $('button').on('click', (e)=> {
        e.preventDefault();
        
        app.loadNextQuestion(app.questions, app.correctAnswers, app.incorrectAnswers);
        

    })
}


app.init = () => {
    app.getData();
}


$(function () {
    app.init();

});
