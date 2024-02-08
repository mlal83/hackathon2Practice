const startBtn = document.getElementById('start-btn');
const difficultySelect = document.getElementById('difficulty');
const quizContainer = document.getElementById('quiz-container');
const quizContent = document.getElementById('quiz-content');
const questionNumber = document.getElementById('question-number');
const scoreContainer = document.getElementById('score-container');

// api array for quiz questions at all difficulties
const apiArray = {
    easy: {
        url: "https://opentdb.com/api.php?amount=20&category=9&difficulty=easy&type=multiple"
    },
    medium: {
        url: "https://opentdb.com/api.php?amount=20&category=9&difficulty=medium&type=multiple"
    },
    hard: {
        url: "https://opentdb.com/api.php?amount=20&category=9&difficulty=hard&type=multiple"
    },
};
let currentQuestionIndex = 0;
let quizData;
let score = 0;
// fetching difficulty function
function fetchData(difficulty) {
    const url = apiArray[difficulty].url;
    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else if (response.status === 429) {
                console.log("You've made too many requests in a short period.");
                return;
            }
            return response.json();
        })
        .then((data) => {
            console.log(data);
            quizData = data.results;
            displayCurrentQuestion();
        })
        .catch((error) => console.error("Could not fetch quiz data:", error));
}
// current question function
function displayCurrentQuestion() {
    const quizContent = document.getElementById("quiz-content");
    const questionNumber = document.getElementById("question-number");
    quizContent.innerHTML = ""; // Clear previous contents
    const currentQuestion = quizData[currentQuestionIndex];
    questionNumber.textContent = `Question ${currentQuestionIndex + 1}`;
    quizContent.innerHTML += `<div><p>${currentQuestion.question}</p>`;
    currentQuestion.incorrect_answers.forEach((incorrectAnswer) => {
        quizContent.innerHTML += `<label><input type="radio" name="q" value="${incorrectAnswer}">${incorrectAnswer}</label>`;
    });
    quizContent.innerHTML += `<label><input type="radio" name="q" value="${currentQuestion.correct_answer}">${currentQuestion.correct_answer}</label></div>`;
    quizContent.innerHTML += '<br><button onclick="submitAnswer()">Submit</button>';
}
// start quiz function v1
// function startQuiz() {
//     resetQuiz();
//     const difficulty = document.getElementById('difficulty').value;
//     fetchData(difficulty);
// }
// start function v2
function startQuiz() {
    resetQuiz();
    const difficulty = document.getElementById('difficulty').value;
    fetchData(difficulty);
    // Hide difficulty selector and start button
    document.getElementById('difficulty').style.display = 'none';
    document.getElementById('start-btn').style.display = 'none';
}
// submit button
function submitAnswer() {
    const selectedAnswer = document.querySelector('input[name="q"]:checked');
    if (!selectedAnswer) {
        alert('Please select an answer before submitting.');
        return;
    }
    // Check if the selected answer is correct
    const isCorrect = selectedAnswer.value === quizData[currentQuestionIndex].correct_answer;
    if (isCorrect) {
        score++;
        updateScore();
    }
    // Move to the next question
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        displayCurrentQuestion();
    } else {
        endQuiz();
    }
}
// update score function
function updateScore() {
    const scoreContainer = document.getElementById('score-container');
    scoreContainer.textContent = `Score: ${score}`;
}
// end quiz function
function endQuiz() {
    alert(`Quiz finished! Your final score: ${score}/${quizData.length}`);
}
// change difficulty function
function changeDifficulty() {
    resetQuiz();
}
// reset quiz function
function resetQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    updateScore();
    document.getElementById("question-number").textContent = ""; // Clear question number
}

// event listners

startBtn.addEventListener('click', startQuiz);
difficultySelect.addEventListener('change', changeDifficulty);