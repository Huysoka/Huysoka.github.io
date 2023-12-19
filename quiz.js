const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const homeButton = document.getElementById("home-btn"); 
const progressBar = document.getElementById("progress-bar");

let currentQuestionIndex = 0;
let score = 0;
let fetchedQuestions = [];

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Next";
}

function showQuestion() {
    resetState();
    let currentQuestion = fetchedQuestions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

    let answerIndices = currentQuestion.answers.map((answer, index) => index);


    answerIndices = shuffleArray(answerIndices);


    answerIndices.forEach(index => {
        const answer = currentQuestion.answers[index];
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        answerButtons.appendChild(button);
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
    });

    updateProgressBar();
}


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function updateProgressBar() {
    const progress = ((currentQuestionIndex + 1) / fetchedQuestions.length) * 100;
    progressBar.style.width = `${progress}%`;
}

function resetState() {
    nextButton.style.display = "none";
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

function selectAnswer(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    if (isCorrect) {
        selectedBtn.classList.add("correct");
        score++;
    } else {
        selectedBtn.classList.add("incorrect");
    }
    Array.from(answerButtons.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        }
        button.disabled = true;
    });
    nextButton.style.display = "block";
}

function showScore() {
    resetState();
    questionElement.innerHTML = `You scored ${score} out of ${fetchedQuestions.length}!`;
    homeButton.innerHTML = "Return to Home";
    homeButton.style.display = "block";

    homeButton.addEventListener("click", () => {
        location.href = "index.html";
    });
}

function handleNextButton() {
    currentQuestionIndex++;
    if (currentQuestionIndex < fetchedQuestions.length) {
        showQuestion();
    } else {
        showScore();
        startQuiz(); 
    }
}


document.addEventListener('DOMContentLoaded', (event) => {
    fetch('fragen/fragen.csv')
        .then(response => response.text())
        .then(data => {
            fetchedQuestions = data.split('\n').map(line => {
                const parts = line.split(',');
                return {
                    question: parts[0].replace(/"/g, ''),
                    answers: [
                        { text: parts[1].replace(/"/g, ''), correct: parts[2] === 'true' },
                        { text: parts[3].replace(/"/g, ''), correct: parts[4] === 'true' },
                        { text: parts[5].replace(/"/g, ''), correct: parts[6] === 'true' },
                        { text: parts[7].replace(/"/g, ''), correct: parts[8] === 'true' },
                    ]
                };
            });

            // Fragen zufällig mischen
            fetchedQuestions = shuffleArray(fetchedQuestions);

            startQuiz();
            showQuestion(); 
        });
});



nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < fetchedQuestions.length) {
        handleNextButton();
    } else {
        startQuiz();
    }
});
