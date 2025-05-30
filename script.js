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
        });        document.getElementById('reset-quiz').addEventListener('click', () => this.resetQuiz());
        document.getElementById('exit-quiz').addEventListener('click', () => this.exitToModules());
        document.getElementById('close-menu').addEventListener('click', () => this.toggleMenu());
        
        // Prevent zoom and drag events
        this.preventZoomAndDrag();
    }
    
    // Prevent zoom and drag functionality
    preventZoomAndDrag() {
        // Prevent zoom with keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '0')) {
                e.preventDefault();
            }
        });
        
        // Prevent zoom with mouse wheel
        document.addEventListener('wheel', (e) => {
            if (e.ctrlKey) {
                e.preventDefault();
            }
        }, { passive: false });
        
        // Prevent touch zoom and drag
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
        
        // Prevent pinch zoom
        document.addEventListener('gesturestart', (e) => {
            e.preventDefault();
        });
        
        document.addEventListener('gesturechange', (e) => {
            e.preventDefault();
        });
        
        document.addEventListener('gestureend', (e) => {
            e.preventDefault();
        });
        
        // Prevent drag and drop
        document.addEventListener('dragstart', (e) => {
            e.preventDefault();
        });
        
        document.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        
        document.addEventListener('drop', (e) => {
            e.preventDefault();
        });
        
        // Prevent context menu
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
        
        // Prevent text selection on touch devices
        document.addEventListener('selectstart', (e) => {
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
            }
        });
    }

    // Screen Management
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
    }    // Certificate Generation as Image
    downloadCertificate() {
        const moduleName = this.quizData.modules[this.currentModule].name;
        const percentage = Math.round((this.score / this.questions.length) * 100);
        const date = new Date().toLocaleDateString();

        // Create canvas for certificate
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size (A4 landscape ratio)
        canvas.width = 1200;
        canvas.height = 850;
        
        // Create gradient background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Create white certificate area
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(0,0,0,0.2)';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 10;
        
        const certX = 80;
        const certY = 80;
        const certWidth = canvas.width - 160;
        const certHeight = canvas.height - 160;
        
        // Rounded rectangle function
        this.roundedRect(ctx, certX, certY, certWidth, certHeight, 15);
        ctx.fill();
        
        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        // Add decorative border
        ctx.strokeStyle = '#1976d2';
        ctx.lineWidth = 4;
        this.roundedRect(ctx, certX + 20, certY + 20, certWidth - 40, certHeight - 40, 10);
        ctx.stroke();
        
        // Certificate Title
        ctx.fillStyle = '#1976d2';
        ctx.font = 'bold 48px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Certificate of Completion', canvas.width / 2, 200);
        
        // Subtitle
        ctx.fillStyle = '#333333';
        ctx.font = 'bold 28px Arial, sans-serif';
        ctx.fillText('Data Centre Professional Assessment', canvas.width / 2, 250);
        
        // "This certifies that" text
        ctx.fillStyle = '#666666';
        ctx.font = '22px Arial, sans-serif';
        ctx.fillText('This certifies that', canvas.width / 2, 320);
        
        // User name (larger and highlighted)
        ctx.fillStyle = '#1976d2';
        ctx.font = 'bold 36px Arial, sans-serif';
        ctx.fillText(this.userName, canvas.width / 2, 380);
        
        // Draw underline for name
        const nameMetrics = ctx.measureText(this.userName);
        ctx.strokeStyle = '#1976d2';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo((canvas.width - nameMetrics.width) / 2, 390);
        ctx.lineTo((canvas.width + nameMetrics.width) / 2, 390);
        ctx.stroke();
        
        // "has successfully completed" text
        ctx.fillStyle = '#666666';
        ctx.font = '22px Arial, sans-serif';
        ctx.fillText('has successfully completed', canvas.width / 2, 440);
        
        // Module name
        ctx.fillStyle = '#333333';
        ctx.font = 'bold 26px Arial, sans-serif';
        ctx.fillText(moduleName, canvas.width / 2, 490);
        
        // Score
        ctx.fillStyle = '#4caf50';
        ctx.font = 'bold 32px Arial, sans-serif';
        ctx.fillText(`Score: ${percentage}%`, canvas.width / 2, 550);
        
        // Date
        ctx.fillStyle = '#999999';
        ctx.font = '20px Arial, sans-serif';
        ctx.fillText(`Completed on ${date}`, canvas.width / 2, 620);
        
        // Add decorative elements
        this.addCertificateDecorations(ctx, canvas.width, canvas.height);
        
        // Test certificate generation capability
        console.log('🎨 Certificate image generation capability:', {
            canvas: !!document.createElement('canvas').getContext,
            blob: !!HTMLCanvasElement.prototype.toBlob,
            download: !!document.createElement('a').download
        });
        
        // Convert canvas to blob and download
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Certificate_${this.userName.replace(/\s+/g, '_')}_${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 'image/png');
    }
    
    // Helper function for rounded rectangles
    roundedRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }
    
    // Add decorative elements to certificate
    addCertificateDecorations(ctx, width, height) {
        // Add corner decorations
        ctx.fillStyle = '#1976d2';
        ctx.globalAlpha = 0.1;
        
        // Top left decoration
        ctx.beginPath();
        ctx.arc(120, 120, 30, 0, Math.PI * 2);
        ctx.fill();
        
        // Top right decoration
        ctx.beginPath();
        ctx.arc(width - 120, 120, 30, 0, Math.PI * 2);
        ctx.fill();
        
        // Bottom left decoration
        ctx.beginPath();
        ctx.arc(120, height - 120, 30, 0, Math.PI * 2);
        ctx.fill();
        
        // Bottom right decoration
        ctx.beginPath();
        ctx.arc(width - 120, height - 120, 30, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.globalAlpha = 1;
        
        // Add professional seal/badge
        ctx.fillStyle = '#1976d2';
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(width - 180, height - 180, 60, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('CERTIFIED', width - 180, height - 185);
        ctx.font = '12px Arial, sans-serif';
        ctx.fillText('PROFESSIONAL', width - 180, height - 170);
        
        ctx.globalAlpha = 1;
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
