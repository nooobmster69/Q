// Professional Quiz App - Complete JavaScript Implementation
// Handles screen navigation, user management, quiz logic, and certificate generation

class QuizApp {
    constructor() {
        this.currentScreen = 'welcome';
        this.userName = '';
        this.userPreferences = {
            showAnswers: true,
            showFeedback: true
        };
        this.quizData = null;
        this.currentModule = null;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = [];
        this.questions = [];
        this.isAnswerRevealed = false;
        this.shuffleQuestions = true;
        this.shuffleAnswers = true;
        
        this.init();
    }    async init() {
        try {
            console.log('🔧 Initializing Professional Quiz App...');
            console.log('🎯 Current screen will be set to: welcome');
            
            this.bindEvents();
            console.log('✅ Events bound successfully');
            
            await this.loadQuizData();
            console.log('✅ Quiz data loaded successfully');
            
            this.showScreen('welcome');
            console.log('✅ Welcome screen shown successfully');
            
        } catch (error) {
            console.error('❌ Initialization failed:', error);
            this.showError(`Initialization failed: ${error.message}`);
        }
    }

    // Event Binding
    bindEvents() {
        // Welcome Screen Events
        document.getElementById('start-btn').addEventListener('click', () => this.handleStartApp());
        document.getElementById('user-name').addEventListener('input', () => this.validateName());
        document.getElementById('user-name').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleStartApp();
        });

        // Module Screen Events
        document.getElementById('back-to-welcome').addEventListener('click', () => this.showScreen('welcome'));

        // Quiz Screen Events
        document.getElementById('back-to-modules').addEventListener('click', () => this.showScreen('module'));
        document.getElementById('quiz-menu').addEventListener('click', () => this.toggleMenu());
        document.getElementById('reveal-answer').addEventListener('click', () => this.revealAnswer());
        document.getElementById('next-question').addEventListener('click', () => this.nextQuestion());
        document.getElementById('retry-btn').addEventListener('click', () => this.loadQuizData());        // Results Screen Events
        document.getElementById('download-certificate').addEventListener('click', () => this.downloadCertificate());
        document.getElementById('retake-quiz').addEventListener('click', () => this.showScreen('module'));
        document.getElementById('back-to-home').addEventListener('click', () => this.backToHome());

        // Menu Events
        document.getElementById('menu-overlay').addEventListener('click', (e) => {
            if (e.target.id === 'menu-overlay') this.toggleMenu();
        });
        document.getElementById('reset-quiz').addEventListener('click', () => this.resetQuiz());
        document.getElementById('exit-quiz').addEventListener('click', () => this.exitToModules());
        document.getElementById('close-menu').addEventListener('click', () => this.toggleMenu());
    }    // Screen Management
    showScreen(screenName) {
        console.log(`📺 Switching to screen: ${screenName}`);
        
        try {
            // Remove active class from all screens
            const allScreens = document.querySelectorAll('.screen');
            console.log(`🔍 Found ${allScreens.length} screen elements`);
            
            allScreens.forEach(screen => {
                screen.classList.remove('active');
            });

            // Add active class to target screen
            const targetScreen = document.getElementById(`${screenName}-screen`);

            if (!targetScreen) {
                console.error(`❌ Target screen not found: ${screenName}-screen`);
                return;
            }

            console.log(`✅ Target screen found: ${screenName}-screen`);
            targetScreen.classList.add('active');
            this.currentScreen = screenName;

            // Screen-specific initialization
            console.log(`🎬 Initializing screen: ${screenName}`);
            switch (screenName) {
                case 'welcome':
                    this.initWelcomeScreen();
                    break;
                case 'module':
                    this.initModuleScreen();
                    break;
                case 'quiz':
                    this.initQuizScreen();
                    break;
                case 'results':
                    this.initResultsScreen();
                    break;
            }
            console.log(`✅ Screen initialization complete: ${screenName}`);
            
        } catch (error) {
            console.error(`❌ Error switching to screen ${screenName}:`, error);
        }
    }

    // Welcome Screen
    initWelcomeScreen() {
        const nameInput = document.getElementById('user-name');
        nameInput.value = this.userName;
        nameInput.focus();
    }

    validateName() {
        const nameInput = document.getElementById('user-name');
        const errorElement = document.getElementById('name-error');
        const startBtn = document.getElementById('start-btn');
        
        const name = nameInput.value.trim();
        const isValid = name.length >= 2 && /^[a-zA-Z\s]+$/.test(name);
        
        if (name.length > 0 && !isValid) {
            errorElement.textContent = 'Please enter a valid name (letters only)';
            errorElement.classList.add('show');
            startBtn.disabled = true;
        } else {
            errorElement.classList.remove('show');
            startBtn.disabled = !isValid;
        }
        
        return isValid;    }
    
    handleStartApp() {
        if (this.validateName()) {
            this.userName = document.getElementById('user-name').value.trim();
            this.userPreferences.showAnswers = document.getElementById('show-answers').checked;
            this.userPreferences.showFeedback = document.getElementById('show-feedback').checked;
            
            console.log('User preferences:', this.userPreferences);
            this.showScreen('module');
        }
    }

    // Module Screen
    initModuleScreen() {
        document.getElementById('display-name').textContent = this.userName;
        
        // Show loading state if data isn't loaded yet
        if (!this.quizData) {
            const container = document.getElementById('modules-container');
            container.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <div class="loading-spinner" style="margin: 0 auto 16px;"></div>
                    <p style="color: var(--text-secondary);">Loading modules...</p>
                </div>
            `;
        } else {
            this.renderModules();
        }
    }

    renderModules() {
        const container = document.getElementById('modules-container');
        container.innerHTML = '';

        if (!this.quizData || !this.quizData.modules) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
                    <div class="error-icon" style="margin: 0 auto 16px;">
                        <span class="material-icons">error_outline</span>
                    </div>
                    <p>No modules available. Please check the quiz data file.</p>
                </div>
            `;
            console.error('❌ No quiz data or modules found');
            return;
        }

        console.log('📚 Rendering modules...');
        console.log(`📊 Total modules available: ${this.quizData.modules.length}`);
        
        this.quizData.modules.forEach((module, index) => {
            console.log(`📋 Module ${index + 1}: "${module.name}" (${module.questions ? module.questions.length : 0} questions)`);
            
            const moduleCard = document.createElement('div');
            moduleCard.className = 'module-card';
            moduleCard.innerHTML = `
                <h3>${module.name}</h3>
                <div class="question-count">
                    <span class="material-icons">quiz</span>
                    <span>${module.questions ? module.questions.length : 0} questions</span>
                </div>
            `;
            
            moduleCard.addEventListener('click', () => this.startModule(index));
            container.appendChild(moduleCard);
        });
        
        console.log(`✅ Successfully rendered ${this.quizData.modules.length} module cards`);
        console.log(`🎯 DOM container now has ${container.children.length} child elements`);
    }

    startModule(moduleIndex) {
        this.currentModule = moduleIndex;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = [];
        this.isAnswerRevealed = false;
        
        // Prepare questions with optional shuffling
        this.questions = [...this.quizData.modules[moduleIndex].questions];
        
        if (this.shuffleQuestions) {
            this.questions = this.shuffleArray(this.questions);
        }
        
        // Shuffle answers if enabled
        if (this.shuffleAnswers) {
            this.questions = this.questions.map(question => this.shuffleQuestionOptions(question));
        }
        
        this.showScreen('quiz');
    }

    // Quiz Screen
    initQuizScreen() {
        if (this.currentModule === null || !this.questions.length) {
            this.showError('Quiz data not available');
            return;
        }

        const moduleName = this.quizData.modules[this.currentModule].name;
        document.getElementById('current-module-name').textContent = moduleName;
        document.getElementById('total-questions').textContent = this.questions.length;
        
        this.hideStates();
        this.displayQuestion();
    }

    hideStates() {
        document.getElementById('loading-state').style.display = 'none';
        document.getElementById('error-state').style.display = 'none';
        document.getElementById('question-container').style.display = 'block';
    }    displayQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        if (!question) return;

        // Update UI elements
        document.getElementById('question-text').textContent = question.q;
        document.getElementById('question-indicator').textContent = 
            `Question ${this.currentQuestionIndex + 1} of ${this.questions.length}`;
        
        // Hide score display during quiz (prevent cheating)
        document.getElementById('score').textContent = '?';
        
        // Update progress bar
        const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
        document.getElementById('progress-fill').style.width = `${progress}%`;

        // Render options
        this.renderOptions(question);
        
        // Reset button states based on user preferences
        const revealButton = document.getElementById('reveal-answer');
        if (this.userPreferences.showAnswers) {
            revealButton.style.display = 'inline-flex';
            revealButton.disabled = false;
        } else {
            revealButton.style.display = 'none';
        }
        
        document.getElementById('next-question').disabled = true;
        this.isAnswerRevealed = false;
    }

    renderOptions(question) {
        const container = document.getElementById('options-container');
        container.innerHTML = '';

        question.opts.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.innerHTML = `
                <div class="option-indicator">${String.fromCharCode(65 + index)}</div>
                <div class="option-text">${option.substring(3)}</div>
            `;
            
            optionElement.addEventListener('click', () => this.selectAnswer(index, optionElement));
            container.appendChild(optionElement);
        });
    }

    selectAnswer(answerIndex, optionElement) {
        if (this.isAnswerRevealed) return;

        // Remove previous selections
        document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
        
        // Mark as selected
        optionElement.classList.add('selected');
        
        // Store answer
        this.userAnswers[this.currentQuestionIndex] = answerIndex;
        
        // Enable next button
        document.getElementById('next-question').disabled = false;
    }    revealAnswer() {
        if (this.isAnswerRevealed || !this.userPreferences.showAnswers) return;
        
        const question = this.questions[this.currentQuestionIndex];
        const correctAnswerIndex = question.opts.findIndex(opt => opt.startsWith(question.a));
        
        document.querySelectorAll('.option').forEach((opt, index) => {
            if (index === correctAnswerIndex) {
                opt.classList.add('correct');
            } else if (opt.classList.contains('selected')) {
                opt.classList.add('incorrect');
            }
        });
        
        this.isAnswerRevealed = true;
        document.getElementById('reveal-answer').disabled = true;
        document.getElementById('next-question').disabled = false;
    }

    nextQuestion() {
        // Check if answer is correct
        const question = this.questions[this.currentQuestionIndex];
        const correctAnswerIndex = question.opts.findIndex(opt => opt.startsWith(question.a));
        const userAnswerIndex = this.userAnswers[this.currentQuestionIndex];
        
        if (userAnswerIndex === correctAnswerIndex) {
            this.score++;
        }

        this.currentQuestionIndex++;
        
        if (this.currentQuestionIndex >= this.questions.length) {
            this.showResults();
        } else {
            this.displayQuestion();
        }
    }

    // Results Screen
    showResults() {
        this.showScreen('results');
    }

    initResultsScreen() {
        const totalQuestions = this.questions.length;
        const percentage = Math.round((this.score / totalQuestions) * 100);
        const moduleName = this.quizData.modules[this.currentModule].name;
        const passingScore = this.quizData.config.passingScore || 70;
        const passed = percentage >= passingScore;

        // Update result elements
        document.getElementById('final-score').textContent = `${percentage}%`;
        document.getElementById('correct-count').textContent = `${this.score}/${totalQuestions}`;
        document.getElementById('completed-module').textContent = moduleName;
        document.getElementById('pass-status').textContent = passed ? 'Passed' : 'Failed';
        document.getElementById('pass-status').style.color = passed ? 'var(--success-color)' : 'var(--error-color)';

        // Update result icon and title
        const resultIcon = document.getElementById('result-icon');
        const resultTitle = document.getElementById('result-title');
        const resultSubtitle = document.getElementById('result-subtitle');

        if (passed) {
            resultIcon.innerHTML = '<span class="material-icons">emoji_events</span>';
            resultIcon.style.background = 'linear-gradient(135deg, var(--success-color), #66bb6a)';
            resultTitle.textContent = 'Congratulations!';
            resultSubtitle.textContent = 'You have successfully completed the assessment';
        } else {
            resultIcon.innerHTML = '<span class="material-icons">error_outline</span>';
            resultIcon.style.background = 'linear-gradient(135deg, var(--error-color), #ef5350)';
            resultTitle.textContent = 'Assessment Complete';
            resultSubtitle.textContent = 'Keep studying and try again to improve your score';
        }        // Update score circle
        this.updateScoreCircle(percentage);
        
        // Generate detailed feedback if enabled
        this.generateDetailedFeedback();
    }

    generateDetailedFeedback() {
        const feedbackSection = document.getElementById('detailed-feedback');
        
        if (!this.userPreferences.showFeedback) {
            feedbackSection.style.display = 'none';
            return;
        }
        
        feedbackSection.style.display = 'block';
        const feedbackContent = document.getElementById('feedback-content');
        feedbackContent.innerHTML = '';
        
        this.questions.forEach((question, index) => {
            const userAnswerIndex = this.userAnswers[index];
            const correctAnswerIndex = question.opts.findIndex(opt => opt.startsWith(question.a));
            const isCorrect = userAnswerIndex === correctAnswerIndex;
            
            const feedbackItem = document.createElement('div');
            feedbackItem.className = 'feedback-item';
            
            feedbackItem.innerHTML = `
                <div class="feedback-question">${index + 1}. ${question.q}</div>
                <div class="feedback-answers">
                    ${question.opts.map((option, optIndex) => {
                        let className = 'feedback-answer neutral';
                        let icon = '';
                        
                        if (optIndex === correctAnswerIndex) {
                            className = 'feedback-answer correct';
                            icon = '<span class="material-icons">check_circle</span>';
                        } else if (optIndex === userAnswerIndex && !isCorrect) {
                            className = 'feedback-answer incorrect';
                            icon = '<span class="material-icons">cancel</span>';
                        }
                        
                        return `<div class="${className}">${icon}${option}</div>`;
                    }).join('')}
                </div>
                <div class="feedback-status ${isCorrect ? 'correct' : 'incorrect'}">
                    <span class="material-icons">${isCorrect ? 'check_circle' : 'cancel'}</span>
                    <span>${isCorrect ? 'Correct' : 'Incorrect'}</span>
                </div>
            `;
            
            feedbackContent.appendChild(feedbackItem);
        });
    }

    updateScoreCircle(percentage) {
        const scoreCircle = document.getElementById('score-circle');
        const degrees = (percentage / 100) * 360;
        
        scoreCircle.style.background = `conic-gradient(
            var(--primary-color) 0deg,
            var(--primary-color) ${degrees}deg,
            #e0e0e0 ${degrees}deg,
            #e0e0e0 360deg
        )`;
    }

    // Certificate Generation
    downloadCertificate() {
        const moduleName = this.quizData.modules[this.currentModule].name;
        const percentage = Math.round((this.score / this.questions.length) * 100);
        const date = new Date().toLocaleDateString();

        // Create certificate content
        const certificateHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Certificate of Completion</title>
                <style>
                    body {
                        font-family: 'Georgia', serif;
                        margin: 0;
                        padding: 40px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .certificate {
                        background: white;
                        padding: 60px;
                        border-radius: 20px;
                        text-align: center;
                        box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                        max-width: 800px;
                        width: 100%;
                    }
                    .certificate h1 {
                        font-size: 48px;
                        color: #1976d2;
                        margin-bottom: 20px;
                        border-bottom: 3px solid #1976d2;
                        padding-bottom: 20px;
                    }
                    .certificate h2 {
                        font-size: 24px;
                        color: #333;
                        margin-bottom: 30px;
                    }
                    .name {
                        font-size: 36px;
                        color: #1976d2;
                        margin: 30px 0;
                        text-decoration: underline;
                    }
                    .details {
                        font-size: 18px;
                        color: #666;
                        margin: 20px 0;
                    }
                    .score {
                        font-size: 24px;
                        color: #4caf50;
                        font-weight: bold;
                        margin: 20px 0;
                    }
                    .date {
                        font-size: 16px;
                        color: #999;
                        margin-top: 40px;
                    }
                </style>
            </head>
            <body>
                <div class="certificate">
                    <h1>Certificate of Completion</h1>
                    <h2>Data Centre Professional Assessment</h2>
                    <p class="details">This certifies that</p>
                    <div class="name">${this.userName}</div>
                    <p class="details">has successfully completed</p>
                    <div class="details"><strong>${moduleName}</strong></div>
                    <div class="score">Score: ${percentage}%</div>
                    <div class="date">Completed on ${date}</div>
                </div>
            </body>
            </html>
        `;

        // Create and download the certificate
        const blob = new Blob([certificateHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Certificate_${this.userName.replace(/\s+/g, '_')}_${Date.now()}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Menu Management
    toggleMenu() {
        const menuOverlay = document.getElementById('menu-overlay');
        menuOverlay.classList.toggle('active');
    }

    resetQuiz() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = [];
        this.isAnswerRevealed = false;
        this.toggleMenu();
        this.initQuizScreen();
    }    exitToModules() {
        this.toggleMenu();
        this.showScreen('module');
    }    backToHome() {
        console.log('backToHome called - resetting app state');
        // Reset user data and go back to welcome screen
        this.userName = '';
        this.userPreferences = {
            showAnswers: true,
            showFeedback: true
        };
        this.currentModule = null;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = [];
        this.questions = [];
        this.isAnswerRevealed = false;
        
        // Clear the name input
        const nameInput = document.getElementById('user-name');
        if (nameInput) {
            nameInput.value = '';
        }
        
        // Reset checkboxes to default
        const showAnswersCheck = document.getElementById('show-answers');
        const showFeedbackCheck = document.getElementById('show-feedback');
        if (showAnswersCheck) showAnswersCheck.checked = true;
        if (showFeedbackCheck) showFeedbackCheck.checked = true;
        
        this.showScreen('welcome');
    }

    // Utility Functions
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    shuffleQuestionOptions(question) {
        const correctAnswer = question.a;
        const correctOption = question.opts.find(opt => opt.startsWith(correctAnswer));
        
        // Create new options array without the letter prefixes for shuffling
        const optionsWithoutPrefixes = question.opts.map(opt => opt.substring(3));
        const shuffledOptions = this.shuffleArray(optionsWithoutPrefixes);
        
        // Find the new position of the correct answer
        const correctIndex = shuffledOptions.indexOf(correctOption.substring(3));
        const newCorrectLetter = String.fromCharCode(65 + correctIndex);
          // Reconstruct the options with new letter prefixes
        const newOptions = shuffledOptions.map((opt, index) => 
            `${String.fromCharCode(65 + index)}. ${opt}`
        );
        
        return {
            ...question,
            opts: newOptions,
            a: newCorrectLetter
        };
    }

    // Data Loading
    async loadQuizData() {
        try {
            console.log('🔄 Loading quiz data from quiz-modules.json...');
            
            const response = await fetch('quiz-modules.json');
            if (!response.ok) {
                throw new Error(`Failed to load quiz data: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('✅ Quiz data loaded successfully');
            console.log('📄 Raw data structure:', {
                type: typeof data,
                isArray: Array.isArray(data),
                hasModulesProperty: data.hasOwnProperty('modules')
            });
              
            // Handle new array-based structure
            if (Array.isArray(data)) {
                this.quizData = {
                    modules: data,
                    config: {
                        shuffleQuestions: true,
                        shuffleOptions: true,
                        passingScore: 70,
                        showScoreOnCompletion: true,
                        allowRevealAnswer: true
                    }
                };
                console.log(`📚 Loaded ${data.length} modules from array structure`);
                
                // Log each module for verification
                data.forEach((module, index) => {
                    console.log(`📖 Module ${index + 1}: "${module.name}" (${module.questions ? module.questions.length : 0} questions)`);
                });
                
            } else {
                // Handle old object-based structure
                this.quizData = data;
                console.log(`📚 Loaded ${data.modules ? data.modules.length : 0} modules from object structure`);
            }
            
            // Update shuffle settings from config
            if (this.quizData.config) {
                this.shuffleQuestions = this.quizData.config.shuffleQuestions !== false;
                this.shuffleAnswers = this.quizData.config.shuffleOptions !== false;
            }
            
            // If we're on the module screen, render the modules
            if (this.currentScreen === 'module') {
                console.log('🎯 Current screen is module, rendering modules now...');
                this.renderModules();
            }
            
        } catch (error) {
            console.error('❌ Error loading quiz data:', error);
            this.showError(`Failed to load quiz data: ${error.message}`);
        }
    }

    showLoadingState() {
        const loadingState = document.getElementById('loading-state');
        const errorState = document.getElementById('error-state');
        const questionContainer = document.getElementById('question-container');
        
        if (loadingState) loadingState.style.display = 'block';
        if (errorState) errorState.style.display = 'none';
        if (questionContainer) questionContainer.style.display = 'none';
    }

    showError(message) {
        const loadingState = document.getElementById('loading-state');
        const errorState = document.getElementById('error-state');
        const questionContainer = document.getElementById('question-container');
        const errorMessage = document.getElementById('error-message');
        
        if (loadingState) loadingState.style.display = 'none';
        if (errorState) errorState.style.display = 'block';
        if (questionContainer) questionContainer.style.display = 'none';
        if (errorMessage) errorMessage.textContent = message;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM loaded, initializing Quiz App...');
    console.log('🔍 DOM elements check:');
    console.log('  - modules-container:', document.getElementById('modules-container') ? 'Found' : 'Missing');
    console.log('  - welcome-screen:', document.getElementById('welcome-screen') ? 'Found' : 'Missing');
    console.log('  - module-screen:', document.getElementById('module-screen') ? 'Found' : 'Missing');
    
    try {
        window.quizApp = new QuizApp();
        console.log('✅ QuizApp instance created successfully');
    } catch (error) {
        console.error('❌ Failed to create QuizApp instance:', error);
    }
});

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    if (window.quizApp) {
        window.quizApp.showError('An unexpected error occurred. Please refresh the page.');
    }
});
