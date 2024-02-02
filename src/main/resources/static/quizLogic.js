document.addEventListener('DOMContentLoaded', () => {

    /* Background stars */

    const canvas = document.createElement('canvas');
    document.getElementById('background-container').appendChild(canvas);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    const stars = 100; 
    const starArray = [];
  
    for (let i = 0; i < stars; i++) {
      starArray.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        speed: Math.random() * 0.05 + 0.05,
      });
    }
  
    function drawStars() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#FFF';
      starArray.forEach(star => {
        star.x += star.speed;
        if (star.x > canvas.width) {
          star.x = 0;
          star.y = Math.random() * canvas.height;
        }
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  
    function update() {
      drawStars();
      requestAnimationFrame(update);
    }
    update();

    /* Actual quiz logic */

    const questions = [
        { question: "As the saying goes, in UNIX, everything a...", answers: ["Process", "File", "Function", "Socket"], correct: 1, userAnswer: null },
        { question: "Which system call is used to create a new process in UNIX?", answers: ["fork()", "exec()", "new()", "create()"], correct: 0, userAnswer: null },
        { question: "What is the main purpose of a socket in network programming?", answers: ["Data storage", "User authentication", "Process synchronization", "Communication between processes"], correct: 3, userAnswer: null },
        { question: "What part of a rocket engine mixes the fuel and oxidizer?", answers: ["Nozzle", "Combustion chamber", "Injector", "Pump"], correct: 2, userAnswer: null },
        { question: "What is the term for the highest point in an orbit around Earth?", answers: ["Perigee", "Apogee", "Apoapsis", "Periapsis"], correct: 1, userAnswer: null },
        { question: "Which principle explains how rockets move in space?", answers: ["Bernoulli's principle", "Newton's third law", "Einstein's theory of relativity", "Pascal's law"], correct: 1, userAnswer: null },
        { question: "What is the common term for the exhaust velocity of a rocket engine?", answers: ["Burn rate", "Thrust", "Specific impulse", "Fuel efficiency"], correct: 2, userAnswer: null }
    ];

    let currentQuestionIndex = 0;
    let score = 0;

    const questionContainer = document.getElementById('question-container');
    const questionElement = document.getElementById('question');
    const answerButtonsElement = document.getElementById('answer-buttons');
    const nextButton = document.getElementById('next-btn');
    const prevButton = document.getElementById('prev-btn');
    const submitButton = document.getElementById('submit-btn');
    const resultsContainer = document.getElementById('results');
    const scoreElement = document.getElementById('score');
    const correctAnswersElement = document.getElementById('correct-answers');

    prevButton.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            setNextQuestion();
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            setNextQuestion();
        }
    });

    submitButton.addEventListener('click', showResults);

    function setNextQuestion() {
        resetState();
        showQuestion(questions[currentQuestionIndex]);
    }

    function showQuestion(question) {
        resetState();
        questionElement.innerText = question.question;
        question.answers.forEach((answer, index) => {
            const button = document.createElement('button');
            button.innerText = answer;
            button.classList.add('btn');
            button.addEventListener('click', () => selectAnswer(index));
            
            if (question.userAnswer === index) {
                button.classList.add('selected-answer');
            }
            
            answerButtonsElement.appendChild(button);
        });
        
        nextButton.disabled = question.userAnswer === null;
        if (currentQuestionIndex === questions.length - 1) {
            submitButton.style.display = 'block';
            submitButton.disabled = question.userAnswer === null;
            nextButton.style.display = 'none';
        } else {
            submitButton.style.display = 'none';
            nextButton.style.display = 'block';
        }
    }

    function resetState() {
        while (answerButtonsElement.firstChild) {
            answerButtonsElement.removeChild(answerButtonsElement.firstChild);
        }
    }

    function selectAnswer(index) {
        questions[currentQuestionIndex].userAnswer = index;

        Array.from(answerButtonsElement.children).forEach((button, buttonIndex) => {
            button.classList.remove('selected-answer');
            if (buttonIndex === index) {
                button.classList.add('selected-answer');
            }
        });

        nextButton.disabled = false;
        if (currentQuestionIndex === questions.length - 1) {
            submitButton.disabled = false;
        }
    }

    function showResults() {
        score = 0;
        questions.forEach(question => {
            if (question.userAnswer === question.correct) {
                score++;
            }
        });

        document.getElementById('results-title').style.display = 'block'; 

        questionContainer.classList.add('hidden');
        resultsContainer.classList.remove('hidden');
        scoreElement.innerText = `${score} out of ${questions.length}`;

        const answersList = document.createElement('ul');
        questions.forEach((question, index) => {
            const questionElem = document.createElement('li');
            const userAnswer = question.userAnswer;
            const isCorrect = userAnswer === question.correct;
            questionElem.classList.add(isCorrect ? 'correct' : 'incorrect');
            questionElem.innerHTML = `
                <strong>Q${index + 1}: ${question.question}</strong>
                <br>Your answer: ${question.answers[userAnswer] || 'No answer'}
                <br>Correct answer: ${question.answers[question.correct]}
                <br>${isCorrect ? 'Correct' : 'Incorrect'}
            `;
            answersList.appendChild(questionElem);
        });

        correctAnswersElement.innerHTML = '';
        correctAnswersElement.appendChild(answersList);

        nextButton.style.display = 'none';
        prevButton.style.display = 'none';
        submitButton.style.display = 'none';

        const celebratoryImage = document.getElementById('celebratory-image');
        celebratoryImage.style.display = 'block'; 
        setTimeout(() => celebratoryImage.classList.add('image-visible'), 10); 
    }

    setNextQuestion();

});
