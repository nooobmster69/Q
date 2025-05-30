// Professional Quiz App - Complete JavaScript Implementation
// Handles screen navigation, user management, quiz logic, and certificate generation

// Application Version Configuration
const APP_VERSION = {
    version: '2.3.0',
    updateDate: 'May 30, 2025 - Enhanced Certificate with Signature Integration',
    appName: 'Data Centre Certification Platform'
};

class QuizApp {
    constructor() {
        this.currentScreen = 'welcome';
        this.userName = '';
        this.userPreferences = {
            showAnswers: true,
            showFeedback: true
        };        this.quizData = null;
        this.currentModule = null;
        // Multi-module support
        this.selectedModules = [];
        this.isMultiModule = false;
        this.isMultiModuleQuiz = false;
        this.moduleQuestionSources = []; // Track which module each question came from
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
            
            // Update version information in UI
            this.updateVersionInfo();
            
        } catch (error) {
            console.error('❌ Initialization failed:', error);
            this.showError(`Initialization failed: ${error.message}`);
        }
    }

    // Update version information in the UI
    updateVersionInfo() {
        // Update welcome screen version
        const versionElement = document.querySelector('.version');
        const updateDateElement = document.querySelector('.update-date');
        
        if (versionElement) {
            versionElement.textContent = `Version ${APP_VERSION.version}`;
        }
        if (updateDateElement) {
            updateDateElement.textContent = `Updated: ${APP_VERSION.updateDate}`;
        }
        
        // Update menu version
        const menuVersionElement = document.querySelector('.version-text');
        const menuUpdateElement = document.querySelector('.update-text');
        
        if (menuVersionElement) {
            menuVersionElement.textContent = `Version ${APP_VERSION.version}`;
        }
        if (menuUpdateElement) {
            menuUpdateElement.textContent = `Updated: ${APP_VERSION.updateDate}`;
        }
        
        console.log(`✅ Version info updated: ${APP_VERSION.version} (${APP_VERSION.updateDate})`);
    }

    // Event Binding
    bindEvents() {
        // Welcome Screen Events
        document.getElementById('start-btn').addEventListener('click', () => this.handleStartApp());
        document.getElementById('user-name').addEventListener('input', () => this.validateName());
        document.getElementById('user-name').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleStartApp();
        });        // Module Screen Events
        document.getElementById('back-to-welcome').addEventListener('click', () => this.showScreen('welcome'));
        document.getElementById('toggle-multi-select').addEventListener('click', () => this.toggleMultiSelectMode());
        document.getElementById('start-multi-quiz').addEventListener('click', () => this.startMultiModuleQuiz());

        // Quiz Screen Events
        document.getElementById('back-to-modules').addEventListener('click', () => this.showScreen('module'));
        document.getElementById('quiz-menu').addEventListener('click', () => this.toggleMenu());
        document.getElementById('reveal-answer').addEventListener('click', () => this.revealAnswer());
        document.getElementById('next-question').addEventListener('click', () => this.nextQuestion());
        document.getElementById('retry-btn').addEventListener('click', () => this.loadQuizData());        // Results Screen Events
        document.getElementById('download-certificate').addEventListener('click', () => this.downloadCertificate());
        document.getElementById('retake-quiz').addEventListener('click', () => this.showScreen('module'));
        document.getElementById('back-to-home').addEventListener('click', () => this.backToHome());
        
        // Feedback toggle with fallback
        const feedbackToggle = document.getElementById('feedback-toggle');
        if (feedbackToggle) {
            feedbackToggle.addEventListener('click', () => this.toggleFeedback());
            console.log('Feedback toggle event listener added');
        } else {
            console.warn('Feedback toggle button not found during initial binding');
        }

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
        
        // Enhanced iPhone zoom prevention
        let lastTouchEnd = 0;
        let lastTouchDistance = 0;
        
        // Prevent double-tap zoom on iPhone
        document.addEventListener('touchend', (e) => {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
                e.stopPropagation();
            }
            lastTouchEnd = now;
        }, { passive: false });
        
        // Prevent pinch zoom - enhanced for iPhone
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length > 1) {
                e.preventDefault();
                e.stopPropagation();
            }
        }, { passive: false });
        
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length > 1) {
                e.preventDefault();
                e.stopPropagation();
            }
        }, { passive: false });
        
        // Prevent pinch zoom gestures
        document.addEventListener('gesturestart', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
        
        document.addEventListener('gesturechange', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
        
        document.addEventListener('gestureend', (e) => {
            e.preventDefault();
            e.stopPropagation();
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
        
        // Additional iPhone-specific prevention
        document.addEventListener('touchcancel', (e) => {
            e.preventDefault();
        });
        
        // Prevent viewport scaling with meta viewport changes
        let viewportMeta = document.querySelector('meta[name=viewport]');
        if (viewportMeta) {
            viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0, shrink-to-fit=no, viewport-fit=cover');
        }
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
    }    // Module Screen
    initModuleScreen() {
        console.log('🎯 Initializing module screen...');
        console.log('📊 Quiz data status:', {
            hasQuizData: !!this.quizData,
            hasModules: !!(this.quizData && this.quizData.modules),
            moduleCount: this.quizData && this.quizData.modules ? this.quizData.modules.length : 0
        });
        
        document.getElementById('display-name').textContent = this.userName;
        
        // Reset multi-module state when returning to module screen
        this.selectedModules = [];
        this.isMultiModuleQuiz = false;
        this.moduleQuestionSources = [];
        this.updateMultiSelectUI();
        
        // Always attempt to render modules, with fallback loading state
        this.renderModulesWithRetry();
    }

    async renderModulesWithRetry() {
        const container = document.getElementById('modules-container');
        
        // Show loading state initially
        container.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <div class="loading-spinner" style="margin: 0 auto 16px;"></div>
                <p style="color: var(--text-secondary);">Loading modules...</p>
            </div>
        `;
        
        // If data isn't loaded yet, wait for it
        if (!this.quizData) {
            console.log('⏳ Quiz data not loaded yet, waiting...');
            let retries = 0;
            const maxRetries = 10;
            
            while (!this.quizData && retries < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, 200));
                retries++;
                console.log(`⏳ Retry ${retries}/${maxRetries} - checking for quiz data...`);
            }
            
            if (!this.quizData) {
                console.error('❌ Quiz data failed to load after retries');
                container.innerHTML = `
                    <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
                        <div class="error-icon" style="margin: 0 auto 16px;">
                            <span class="material-icons">error_outline</span>
                        </div>
                        <p>Failed to load modules. Please refresh the page.</p>
                        <button onclick="location.reload()" style="margin-top: 16px; padding: 8px 16px; background: var(--primary); color: white; border: none; border-radius: 4px; cursor: pointer;">Refresh Page</button>
                    </div>
                `;
                return;
            }
        }
        
        // Data is available, render modules
        console.log('✅ Quiz data is available, rendering modules...');
        this.renderModules();
    }    renderModules() {
        console.log('🎨 renderModules() called');
        const container = document.getElementById('modules-container');
        
        if (!container) {
            console.error('❌ modules-container element not found!');
            return;
        }
        
        console.log('✅ Container found, clearing content...');
        container.innerHTML = '';

        if (!this.quizData || !this.quizData.modules) {
            console.error('❌ No quiz data or modules found:', {
                hasQuizData: !!this.quizData,
                hasModules: !!(this.quizData && this.quizData.modules),
                quizDataType: typeof this.quizData
            });
            
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
                    <div class="error-icon" style="margin: 0 auto 16px;">
                        <span class="material-icons">error_outline</span>
                    </div>
                    <p>No modules available. Please check the quiz data file.</p>
                </div>
            `;
            return;
        }

        console.log('📚 Rendering modules...');
        console.log(`📊 Total modules available: ${this.quizData.modules.length}`);
        console.log('📋 Module data structure:', this.quizData.modules.slice(0, 2));
        
        this.quizData.modules.forEach((module, index) => {
            console.log(`📋 Module ${index + 1}: "${module.name}" (${module.questions ? module.questions.length : 0} questions)`);
            
            const moduleCard = document.createElement('div');
            moduleCard.className = 'module-card';
            
            // Add checkbox for multi-select mode
            const checkbox = this.isMultiModule ? 
                `<div class="module-checkbox">
                    <input type="checkbox" id="module-${index}" data-module-index="${index}">
                    <label for="module-${index}"></label>
                </div>` : '';
              moduleCard.innerHTML = `
                ${checkbox}
                <h3>${module.name}</h3>
                <div class="module-info">
                    <span><span class="material-icons">quiz</span>${module.questions ? module.questions.length : 0} Questions</span>
                    <span><span class="material-icons">access_time</span>~${Math.ceil((module.questions ? module.questions.length : 0) * 1.5)} min</span>
                </div>
            `;
            
            if (this.isMultiModule) {
                // Add event listener for checkbox
                const checkboxElement = moduleCard.querySelector('input[type="checkbox"]');
                checkboxElement.addEventListener('change', () => this.toggleModuleSelection(index));
                
                // Add click handler for the card (excluding checkbox)
                moduleCard.addEventListener('click', (e) => {
                    if (e.target.type !== 'checkbox' && e.target.tagName !== 'LABEL') {
                        checkboxElement.checked = !checkboxElement.checked;
                        this.toggleModuleSelection(index);
                    }
                });
            } else {
                // Single module selection
                moduleCard.addEventListener('click', () => this.startModule(index));
            }
            
            container.appendChild(moduleCard);
        });
        
        console.log(`✅ Successfully rendered ${this.quizData.modules.length} module cards`);
        console.log(`🎯 DOM container now has ${container.children.length} child elements`);
    }    startModule(moduleIndex) {
        console.log(`🚀 Starting single module: ${moduleIndex}`);
        
        // Ensure we have valid module data
        if (!this.quizData || !this.quizData.modules || !this.quizData.modules[moduleIndex]) {
            console.error('❌ Invalid module data for index:', moduleIndex);
            this.showError('Module data not available');
            return;
        }
        
        // Reset multi-module state
        this.isMultiModuleQuiz = false;
        this.selectedModules = [];
        this.moduleQuestionSources = [];
        
        // Set current module
        this.currentModule = moduleIndex;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = [];
        this.isAnswerRevealed = false;
        
        // Prepare questions with optional shuffling
        const moduleQuestions = this.quizData.modules[moduleIndex].questions;
        if (!moduleQuestions || moduleQuestions.length === 0) {
            console.error('❌ No questions found in module:', moduleIndex);
            this.showError('No questions available in this module');
            return;
        }
        
        this.questions = [...moduleQuestions];
        
        console.log(`✅ Loaded ${this.questions.length} questions from module: ${this.quizData.modules[moduleIndex].name}`);
        
        if (this.shuffleQuestions) {
            this.questions = this.shuffleArray(this.questions);
        }
        
        // Shuffle answers if enabled
        if (this.shuffleAnswers) {
            this.questions = this.questions.map(question => this.shuffleQuestionOptions(question));
        }
        
        this.showScreen('quiz');
    }

    // Multi-Module Support Functions
    toggleMultiSelectMode() {
        this.isMultiModule = !this.isMultiModule;
        this.selectedModules = [];
        this.updateMultiSelectUI();
        this.renderModules();
    }

    updateMultiSelectUI() {
        const toggleBtn = document.getElementById('toggle-multi-select');
        const startBtn = document.getElementById('start-multi-quiz');
        
        if (this.isMultiModule) {
            toggleBtn.classList.add('active');
            toggleBtn.innerHTML = '<span class="material-icons">check_box</span><span>Single Select</span>';
            startBtn.style.display = 'block';
            this.updateStartMultiButton();
        } else {
            toggleBtn.classList.remove('active');
            toggleBtn.innerHTML = '<span class="material-icons">library_add</span><span>Multi Select</span>';
            startBtn.style.display = 'none';
        }
    }

    toggleModuleSelection(moduleIndex) {
        const index = this.selectedModules.indexOf(moduleIndex);
        
        if (index === -1) {
            this.selectedModules.push(moduleIndex);
        } else {
            this.selectedModules.splice(index, 1);
        }
        
        this.updateModuleCardSelection(moduleIndex);
        this.updateStartMultiButton();
    }

    updateModuleCardSelection(moduleIndex) {
        const checkbox = document.getElementById(`module-${moduleIndex}`);
        const moduleCard = checkbox.closest('.module-card');
        
        if (this.selectedModules.includes(moduleIndex)) {
            moduleCard.classList.add('selected');
            checkbox.checked = true;
        } else {
            moduleCard.classList.remove('selected');
            checkbox.checked = false;
        }
    }

    updateStartMultiButton() {
        const startBtn = document.getElementById('start-multi-quiz');
        const count = this.selectedModules.length;
        
        if (count === 0) {
            startBtn.disabled = true;
            startBtn.innerHTML = '<span>Select modules to start</span>';
        } else {
            startBtn.disabled = false;
            startBtn.innerHTML = `<span>Start Quiz (${count} module${count > 1 ? 's' : ''})</span><span class="material-icons">arrow_forward</span>`;
        }
    }

    startMultiModuleQuiz() {
        if (this.selectedModules.length === 0) return;
        
        // Reset quiz state
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = [];
        this.isAnswerRevealed = false;
        this.moduleQuestionSources = [];
        this.questions = [];
        
        // Combine questions from selected modules
        this.selectedModules.forEach(moduleIndex => {
            const module = this.quizData.modules[moduleIndex];
            module.questions.forEach(question => {
                this.questions.push(question);
                this.moduleQuestionSources.push({
                    moduleIndex: moduleIndex,
                    moduleName: module.name
                });
            });
        });
        
        // Shuffle questions if enabled
        if (this.shuffleQuestions) {
            const combined = this.questions.map((question, index) => ({
                question,
                source: this.moduleQuestionSources[index]
            }));
            
            const shuffled = this.shuffleArray(combined);
            
            this.questions = shuffled.map(item => item.question);
            this.moduleQuestionSources = shuffled.map(item => item.source);
        }
        
        // Shuffle answers if enabled
        if (this.shuffleAnswers) {
            this.questions = this.questions.map(question => this.shuffleQuestionOptions(question));
        }
        
        // Set flags for multi-module mode
        this.currentModule = null; // Will be handled differently for multi-module
        this.isMultiModuleQuiz = true;
        
        this.showScreen('quiz');
    }    // Quiz Screen
    initQuizScreen() {
        console.log('🎮 Initializing quiz screen...');
        console.log('📊 Quiz state:', {
            currentModule: this.currentModule,
            isMultiModuleQuiz: this.isMultiModuleQuiz,
            questionsLength: this.questions ? this.questions.length : 0,
            selectedModulesLength: this.selectedModules ? this.selectedModules.length : 0
        });
        
        // Check if we have valid quiz data
        if (!this.questions || this.questions.length === 0) {
            console.error('❌ No questions available');
            this.showError('No questions available for this quiz');
            return;
        }
        
        // For single module quiz, ensure currentModule is set
        if (!this.isMultiModuleQuiz && (this.currentModule === null || this.currentModule === undefined)) {
            console.error('❌ No current module set for single module quiz');
            this.showError('Module selection error. Please try again.');
            return;
        }

        // Set module name based on quiz type
        let moduleName;
        if (this.isMultiModuleQuiz) {
            const moduleNames = this.selectedModules.map(index => 
                this.quizData.modules[index].name.replace('Module ', 'M')
            );
            moduleName = `Multi-Module Quiz (${moduleNames.join(', ')})`;
        } else {
            moduleName = this.quizData.modules[this.currentModule].name;
        }
        
        console.log(`✅ Starting quiz: ${moduleName} with ${this.questions.length} questions`);
        
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
    }    initResultsScreen() {
        const totalQuestions = this.questions.length;
        const percentage = Math.round((this.score / totalQuestions) * 100);
        const passingScore = this.quizData.config.passingScore || 70;
        const passed = percentage >= passingScore;
        
        // Set module name based on quiz type
        let moduleName;
        let moduleInfo = '';
        if (this.isMultiModuleQuiz) {
            const moduleNames = this.selectedModules.map(index => this.quizData.modules[index].name);
            moduleName = `Multi-Module Assessment`;
            moduleInfo = `Completed modules: ${moduleNames.join(', ')}`;
        } else {
            moduleName = this.quizData.modules[this.currentModule].name;
            moduleInfo = moduleName;
        }
        
        // Update result elements
        document.getElementById('final-score').textContent = `${this.score}/${totalQuestions}`;
        document.getElementById('correct-count').textContent = `${this.score}/${totalQuestions}`;
        document.getElementById('completed-module').textContent = moduleInfo;
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
    }    // Certificate Generation as Image - Enhanced Design v2.3.0
    async downloadCertificate() {
        // Get module name based on quiz type
        let moduleName;
        let moduleDetails = '';
        if (this.isMultiModuleQuiz) {
            const moduleNames = this.selectedModules.map(index => this.quizData.modules[index].name);
            moduleName = 'Multi-Module Data Centre Assessment';
            moduleDetails = moduleNames;
        } else {
            moduleName = this.quizData.modules[this.currentModule].name;
            moduleDetails = [moduleName];
        }
        
        const percentage = Math.round((this.score / this.questions.length) * 100);
        const date = new Date().toLocaleDateString();

        // Create canvas for certificate
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size (A4 landscape ratio) - slightly larger for better quality
        canvas.width = 1400;
        canvas.height = 990;
        
        // Load signature image
        const signatureImage = await this.loadSignatureImage();
        
        // Create modern gradient background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#1e3c72');
        gradient.addColorStop(0.5, '#2a5298');
        gradient.addColorStop(1, '#1e3c72');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Create white certificate area with modern shadow
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 30;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 15;
        
        const certX = 100;
        const certY = 100;
        const certWidth = canvas.width - 200;
        const certHeight = canvas.height - 200;
        
        // Modern rounded rectangle
        this.roundedRect(ctx, certX, certY, certWidth, certHeight, 20);
        ctx.fill();
        
        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        // Add elegant border with gradient
        const borderGradient = ctx.createLinearGradient(certX, certY, certX + certWidth, certY + certHeight);
        borderGradient.addColorStop(0, '#1976d2');
        borderGradient.addColorStop(0.5, '#42a5f5');
        borderGradient.addColorStop(1, '#1976d2');
        ctx.strokeStyle = borderGradient;
        ctx.lineWidth = 6;
        this.roundedRect(ctx, certX + 30, certY + 30, certWidth - 60, certHeight - 60, 15);
        ctx.stroke();
        
        // Header decoration line
        ctx.strokeStyle = '#1976d2';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(certX + 100, certY + 120);
        ctx.lineTo(certX + certWidth - 100, certY + 120);
        ctx.stroke();
        
        // Certificate Title with enhanced typography
        ctx.fillStyle = '#1976d2';
        ctx.font = 'bold 52px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('Certificate of Excellence', canvas.width / 2, 220);
        
        // Subtitle with elegant styling
        ctx.fillStyle = '#2c5aa0';
        ctx.font = 'italic 30px Georgia, serif';
        ctx.fillText('Professional Data Centre Certification', canvas.width / 2, 270);
        
        // Decorative line under subtitle
        ctx.strokeStyle = '#42a5f5';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2 - 200, 285);
        ctx.lineTo(canvas.width / 2 + 200, 285);
        ctx.stroke();
        
        // "This certifies that" text
        ctx.fillStyle = '#555555';
        ctx.font = '24px Arial, sans-serif';
        ctx.fillText('This certifies that', canvas.width / 2, 340);
        
        // User name with elegant styling
        ctx.fillStyle = '#1976d2';
        ctx.font = 'bold 42px Georgia, serif';
        ctx.fillText(this.userName, canvas.width / 2, 390);
        
        // Enhanced underline for name with gradient
        const nameMetrics = ctx.measureText(this.userName);
        const underlineGradient = ctx.createLinearGradient(
            (canvas.width - nameMetrics.width) / 2, 400,
            (canvas.width + nameMetrics.width) / 2, 400
        );
        underlineGradient.addColorStop(0, 'transparent');
        underlineGradient.addColorStop(0.1, '#1976d2');
        underlineGradient.addColorStop(0.9, '#1976d2');
        underlineGradient.addColorStop(1, 'transparent');
        ctx.strokeStyle = underlineGradient;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo((canvas.width - nameMetrics.width) / 2, 405);
        ctx.lineTo((canvas.width + nameMetrics.width) / 2, 405);
        ctx.stroke();
        
        // "has successfully completed" text
        ctx.fillStyle = '#555555';
        ctx.font = '24px Arial, sans-serif';
        ctx.fillText('has successfully completed', canvas.width / 2, 460);
        
        // Module information with improved layout
        this.renderModuleInformation(ctx, canvas, moduleName, moduleDetails);
        
        // Score with enhanced design
        const scoreY = this.isMultiModuleQuiz ? 650 : 600;
        
        // Score background
        ctx.fillStyle = 'rgba(76, 175, 80, 0.1)';
        this.roundedRect(ctx, canvas.width / 2 - 150, scoreY - 35, 300, 60, 10);
        ctx.fill();
        
        ctx.fillStyle = '#4caf50';
        ctx.font = 'bold 36px Arial, sans-serif';
        ctx.fillText(`Score: ${this.score}/${this.questions.length} (${percentage}%)`, canvas.width / 2, scoreY);
        
        // Date with elegant styling
        ctx.fillStyle = '#666666';
        ctx.font = '22px Georgia, serif';
        ctx.fillText(`Completed on ${date}`, canvas.width / 2, scoreY + 80);
          // Add signature if available
        if (signatureImage) {
            this.addSignatureToCertificate(ctx, canvas, signatureImage);
        }
        
        // Version and Platform Information with better styling
        ctx.fillStyle = '#999999';
        ctx.font = '16px Arial, sans-serif';
        ctx.fillText(`${APP_VERSION.appName} v${APP_VERSION.version}`, canvas.width / 2, canvas.height - 80);
        ctx.font = '14px Arial, sans-serif';
        ctx.fillText(`Updated: ${APP_VERSION.updateDate}`, canvas.width / 2, canvas.height - 60);
        
        // Add enhanced decorative elements
        this.addEnhancedCertificateDecorations(ctx, canvas.width, canvas.height);
        
        // Test certificate generation capability
        console.log('🎨 Enhanced Certificate v2.3.0 generation capability:', {
            canvas: !!document.createElement('canvas').getContext,
            blob: !!HTMLCanvasElement.prototype.toBlob,
            toDataURL: !!HTMLCanvasElement.prototype.toDataURL,
            download: !!document.createElement('a').download,
            signatureLoaded: !!signatureImage,
            userAgent: navigator.userAgent
        });
        
        // Enhanced download with fallback for mobile devices
        const fileName = `Certificate_${this.userName.replace(/\s+/g, '_')}_${Date.now()}.png`;
        
        // Try modern blob method first
        if (canvas.toBlob && typeof canvas.toBlob === 'function') {
            canvas.toBlob((blob) => {
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = fileName;
                    a.style.display = 'none';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    console.log('✅ Enhanced Certificate downloaded via blob method');
                } else {
                    console.warn('⚠️ Blob creation failed, using fallback');
                    this.downloadCertificateFallback(canvas, fileName);
                }
            }, 'image/png', 1.0);
        } else {
            console.warn('⚠️ toBlob not supported, using fallback');
            this.downloadCertificateFallback(canvas, fileName);        }
    }
    
    // Fallback download method for mobile devices
    downloadCertificateFallback(canvas, fileName) {
        try {
            // Use data URL as fallback
            const dataURL = canvas.toDataURL('image/png', 1.0);
            const a = document.createElement('a');
            a.href = dataURL;
            a.download = fileName;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            console.log('✅ Certificate downloaded via data URL fallback');
        } catch (error) {
            console.error('❌ Certificate download failed:', error);
            // Show user-friendly message
            alert('Certificate generation completed! Please use your browser\'s save function to save the certificate image.');
            
            // Open the image in a new window as last resort
            const newWindow = window.open();
            newWindow.document.write(`
                <html>
                    <head><title>Certificate - ${this.userName}</title></head>
                    <body style="margin:0; display:flex; justify-content:center; align-items:center; min-height:100vh; background:#f0f0f0;">
                        <div style="text-align:center;">
                            <img src="${canvas.toDataURL('image/png', 1.0)}" style="max-width:100%; height:auto; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" alt="Certificate">
                            <p style="margin-top:20px; font-family:Arial,sans-serif; color:#666;">Right-click and "Save Image As" to download your certificate</p>
                        </div>
                    </body>
                </html>
            `);
        }
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

    // Load signature image for certificate
    async loadSignatureImage() {
        try {
            const img = new Image();
            return new Promise((resolve, reject) => {
                img.onload = () => {
                    console.log('✅ Signature image loaded successfully');
                    resolve(img);
                };
                img.onerror = (error) => {
                    console.warn('⚠️ Signature image failed to load:', error);
                    resolve(null); // Return null instead of rejecting
                };
                img.src = 'Signature.png'; // Load from same directory as index.html
            });
        } catch (error) {
            console.warn('⚠️ Error loading signature image:', error);
            return null;
        }
    }    // Add signature to certificate
    addSignatureToCertificate(ctx, canvas, signatureImage) {
        if (!signatureImage) return;
        
        try {
            // Position signature in bottom right corner INSIDE the certificate boundary
            // Certificate white area: x=100 to x=canvas.width-100, y=100 to y=canvas.height-100
            const signatureWidth = 180;
            const signatureHeight = 90;
            const signatureX = canvas.width - 100 - signatureWidth - 30; // 30px margin from right edge
            const signatureY = canvas.height - 100 - signatureHeight - 40; // 40px margin from bottom edge
            
            // Add signature background
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            this.roundedRect(ctx, signatureX - 10, signatureY - 10, signatureWidth + 20, signatureHeight + 40, 8);
            ctx.fill();
            
            // Draw signature image
            ctx.drawImage(signatureImage, signatureX, signatureY, signatureWidth, signatureHeight);
            
            // Add "Authorized Signature" label
            ctx.fillStyle = '#666666';
            ctx.font = '14px Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Authorized Signature', signatureX + signatureWidth / 2, signatureY + signatureHeight + 25);
            
            console.log('✅ Signature added to certificate');
        } catch (error) {
            console.warn('⚠️ Error adding signature to certificate:', error);
        }
    }

    // Render module information on certificate with proper text wrapping
    renderModuleInformation(ctx, canvas, moduleName, moduleDetails) {
        ctx.fillStyle = '#2c5aa0';
        ctx.font = 'bold 28px Georgia, serif';
        ctx.textAlign = 'center';
        
        if (this.isMultiModuleQuiz) {
            // Multi-module display with text wrapping
            ctx.fillText(moduleName, canvas.width / 2, 520);
            
            // Add module list with proper wrapping
            ctx.fillStyle = '#555555';
            ctx.font = '18px Arial, sans-serif';
            
            const moduleText = 'Modules Completed: ' + moduleDetails.join(', ');
            const maxWidth = canvas.width - 300;
            const lineHeight = 25;
            const startY = 555;
            
            const wrappedLines = this.wrapText(ctx, moduleText, maxWidth);
            wrappedLines.forEach((line, index) => {
                ctx.fillText(line, canvas.width / 2, startY + (index * lineHeight));
            });
        } else {
            // Single module display
            ctx.fillText(moduleName, canvas.width / 2, 520);
        }
    }

    // Text wrapping utility for certificates
    wrapText(ctx, text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = ctx.measureText(currentLine + ' ' + word).width;
            if (width < maxWidth) {
                currentLine += ' ' + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        return lines;
    }

    // Enhanced decorative elements for certificate
    addEnhancedCertificateDecorations(ctx, width, height) {
        // Save current state
        const originalAlpha = ctx.globalAlpha;
        const originalFillStyle = ctx.fillStyle;
        
        // Add corner decorative elements
        ctx.fillStyle = '#1976d2';
        ctx.globalAlpha = 0.15;
        
        // Top corners with larger decorative circles
        ctx.beginPath();
        ctx.arc(150, 150, 40, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(width - 150, 150, 40, 0, Math.PI * 2);
        ctx.fill();
        
        // Bottom corners
        ctx.beginPath();
        ctx.arc(150, height - 150, 40, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(width - 150, height - 150, 40, 0, Math.PI * 2);
        ctx.fill();
        
        // Add professional certification seal
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = '#1976d2';
        ctx.beginPath();
        ctx.arc(width - 200, height - 220, 70, 0, Math.PI * 2);
        ctx.fill();
        
        // Seal border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(width - 200, height - 220, 65, 0, Math.PI * 2);
        ctx.stroke();
        
        // Seal text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('CERTIFIED', width - 200, height - 230);
        ctx.font = '12px Arial, sans-serif';
        ctx.fillText('PROFESSIONAL', width - 200, height - 215);
        ctx.font = '10px Arial, sans-serif';
        ctx.fillText('DATA CENTRE', width - 200, height - 205);
        
        // Add decorative borders
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = '#42a5f5';
        
        // Top border decoration
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.arc(200 + (i * 200), 130, 8, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Bottom border decoration  
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.arc(200 + (i * 200), height - 130, 8, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Restore original state
        ctx.globalAlpha = originalAlpha;
        ctx.fillStyle = originalFillStyle;
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
    }    // Toggle feedback section visibility
    toggleFeedback() {
        console.log('toggleFeedback called');
        const feedbackToggle = document.getElementById('feedback-toggle');
        const feedbackContent = document.getElementById('feedback-content');
        
        if (!feedbackToggle || !feedbackContent) {
            console.error('Feedback elements not found');
            return;
        }
        
        console.log('Current classes:', feedbackContent.className);
        
        if (feedbackContent.classList.contains('collapsed')) {
            // Expand
            feedbackContent.classList.remove('collapsed');
            feedbackContent.classList.add('expanded');
            feedbackToggle.classList.add('expanded');
            console.log('Expanded feedback section');
        } else {
            // Collapse
            feedbackContent.classList.remove('expanded');
            feedbackContent.classList.add('collapsed');
            feedbackToggle.classList.remove('expanded');
            console.log('Collapsed feedback section');
        }
    }backToHome() {
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

    // Text wrapping utility for certificates
    wrapText(ctx, text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = ctx.measureText(currentLine + ' ' + word).width;
            if (width < maxWidth) {
                currentLine += ' ' + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        return lines;
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
