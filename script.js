// Global variables
let currentModule = 0;
let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;
let answeredQuestions = {};

// DOM Elements
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const scoreElement = document.getElementById('score');
const totalQuestionsElement = document.getElementById('total-questions');
const questionIndicator = document.getElementById('question-indicator');
const moduleNavigation = document.querySelector('.module-navigation');
const prevButton = document.getElementById('prev-question');
const nextButton = document.getElementById('next-question');
const revealButton = document.getElementById('reveal-answer');

// Initialize quiz
function initQuiz() {
    // Create module navigation buttons
    createModuleButtons();
    
    // Set total questions count
    const totalQuestions = quizData.length * quizData[0].questions.length;
    totalQuestionsElement.textContent = totalQuestions;
    
    // Load first question
    loadQuestion();
    
    // Add event listeners
    prevButton.addEventListener('click', navigateToPrevQuestion);
    nextButton.addEventListener('click', navigateToNextQuestion);
    revealButton.addEventListener('click', revealAnswer);
    
    // Initialize answered questions tracking
    quizData.forEach((module, moduleIndex) => {
        answeredQuestions[moduleIndex] = {};
    });
}

// Create module navigation buttons
function createModuleButtons() {
    moduleNavigation.innerHTML = '';
    
    quizData.forEach((module, index) => {
        const button = document.createElement('button');
        button.className = 'module-btn';
        button.textContent = module.name;
        
        if (index === currentModule) {
            button.classList.add('active');
        }
        
        button.addEventListener('click', () => {
            currentModule = index;
            currentQuestion = 0;
            
            // Update active module button
            document.querySelectorAll('.module-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
            
            // Load the first question of the selected module
            loadQuestion();
        });
        
        moduleNavigation.appendChild(button);
    });
}

// Load question based on current module and question index
function loadQuestion() {
    const module = quizData[currentModule];
    const question = module.questions[currentQuestion];
    
    questionText.textContent = question.question;
    
    // Update question indicator
    questionIndicator.textContent = `Question ${currentQuestion + 1}/${module.questions.length}`;
    
    // Create options
    createOptions(question);
    
    // Update navigation buttons state
    updateNavigationButtons();
    
    // Check if this question was already answered
    if (answeredQuestions[currentModule][currentQuestion] !== undefined) {
        const selectedOption = optionsContainer.children[answeredQuestions[currentModule][currentQuestion]];
        if (selectedOption) {
            selectOption(selectedOption, answeredQuestions[currentModule][currentQuestion]);
        }
    } else {
        selectedAnswer = null;
    }
}

// Create option buttons
function createOptions(question) {
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionButton = document.createElement('button');
        optionButton.className = 'option';
        optionButton.textContent = option;
        
        // Add event listener for option selection
        optionButton.addEventListener('click', () => {
            if (answeredQuestions[currentModule][currentQuestion] === undefined) {
                selectOption(optionButton, index);
                checkAnswer(index);
            }
        });
        
        optionsContainer.appendChild(optionButton);
    });
}

// Select an option
function selectOption(optionElement, index) {
    // Clear previous selections
    optionsContainer.querySelectorAll('.option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Select the clicked option
    optionElement.classList.add('selected');
    selectedAnswer = index;
}

// Check if the selected answer is correct
function checkAnswer(selectedIndex) {
    const currentQuestionData = quizData[currentModule].questions[currentQuestion];
    
    // Store the user's answer
    answeredQuestions[currentModule][currentQuestion] = selectedIndex;
    
    // Check if answer is correct
    if (selectedIndex === currentQuestionData.correctAnswer) {
        // Increment score only if this is the first time answering correctly
        if (!answeredQuestions[currentModule][currentQuestion].hasOwnProperty('correct') || 
            !answeredQuestions[currentModule][currentQuestion].correct) {
            score++;
            scoreElement.textContent = score;
            answeredQuestions[currentModule][currentQuestion] = { index: selectedIndex, correct: true };
        }
    } else {
        answeredQuestions[currentModule][currentQuestion] = { index: selectedIndex, correct: false };
    }
}

// Reveal the correct answer
function revealAnswer() {
    const currentQuestionData = quizData[currentModule].questions[currentQuestion];
    const correctAnswerIndex = currentQuestionData.correctAnswer;
    
    // Get all option elements
    const options = optionsContainer.querySelectorAll('.option');
    
    // Mark the correct answer
    options.forEach((option, index) => {
        if (index === correctAnswerIndex) {
            option.classList.add('correct');
        } else if (index === selectedAnswer) {
            option.classList.add('incorrect');
        }
    });
}

// Navigate to previous question
function navigateToPrevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
    } else if (currentModule > 0) {
        currentModule--;
        currentQuestion = quizData[currentModule].questions.length - 1;
        
        // Update active module button
        document.querySelectorAll('.module-btn').forEach((btn, index) => {
            btn.classList.toggle('active', index === currentModule);
        });
        
        loadQuestion();
    }
}

// Navigate to next question
function navigateToNextQuestion() {
    const moduleQuestions = quizData[currentModule].questions;
    
    if (currentQuestion < moduleQuestions.length - 1) {
        currentQuestion++;
        loadQuestion();
    } else if (currentModule < quizData.length - 1) {
        currentModule++;
        currentQuestion = 0;
        
        // Update active module button
        document.querySelectorAll('.module-btn').forEach((btn, index) => {
            btn.classList.toggle('active', index === currentModule);
        });
        
        loadQuestion();
    }
}

// Update navigation buttons state
function updateNavigationButtons() {
    // Disable prev button if on first question of first module
    prevButton.disabled = currentModule === 0 && currentQuestion === 0;
    
    // Disable next button if on last question of last module
    nextButton.disabled = currentModule === quizData.length - 1 && 
                          currentQuestion === quizData[currentModule].questions.length - 1;
}

// Make score display sticky on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    const scoreDisplay = document.querySelector('.score-display');
    
    if (window.scrollY > header.offsetTop) {
        scoreDisplay.classList.add('sticky');
    } else {
        scoreDisplay.classList.remove('sticky');
    }
});

// Initialize the quiz when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initQuiz);
