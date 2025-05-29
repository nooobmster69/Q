// Quiz data structure
const quizData = [
    {
        name: "Module 1: HTML Basics",
        questions: [
            {
                question: "What does HTML stand for?",
                options: [
                    "Hyper Text Markup Language",
                    "Hyper Transfer Markup Language",
                    "High Technical Markup Language",
                    "Hyperlink Text Management Language"
                ],
                correctAnswer: "Hyper Text Markup Language"
            },            {
                question: "Which HTML tag is used to define an internal style sheet?",
                options: [
                    "<css>",
                    "<script>",
                    "<style>",
                    "<link>"
                ],
                correctAnswer: "<style>"
            },
            {
                question: "Which HTML attribute is used to define inline styles?",
                options: [
                    "styles",
                    "style",
                    "css",
                    "class"
                ],
                correctAnswer: "style"
            },
            {
                question: "Which HTML element is used to specify a header for a document or section?",
                options: [
                    "<head>",
                    "<top>",
                    "<header>",
                    "<section>"
                ],
                correctAnswer: "<header>"
            },
            {
                question: "Which HTML element defines navigation links?",
                options: [
                    "<nav>",
                    "<navigation>",
                    "<links>",
                    "<menu>"
                ],
                correctAnswer: "<nav>"
            },
            {
                question: "Which character is used to indicate an end tag?",
                options: [
                    "^",
                    "/",
                    "*",
                    "<"
                ],
                correctAnswer: "/"
            },
            {
                question: "How do you create a numbered list in HTML?",
                options: [
                    "<nl>",
                    "<list>",
                    "<ul>",
                    "<ol>"
                ],
                correctAnswer: "<ol>"
            },
            {
                question: "Which HTML element is used to define an image?",
                options: [
                    "<img>",
                    "<picture>",
                    "<image>",
                    "<src>"
                ],
                correctAnswer: "<img>"
            },
            {
                question: "Which HTML element is used to define important text?",
                options: [
                    "<b>",
                    "<i>",
                    "<strong>",
                    "<important>"
                ],
                correctAnswer: "<strong>"
            },
            {
                question: "Which doctype is correct for HTML5?",
                options: [
                    "<!DOCTYPE HTML5>",
                    "<!DOCTYPE html>",
                    "<DOCTYPE HTML>",
                    "<!DOCTYPE HTML PUBLIC>"
                ],
                correctAnswer: "<!DOCTYPE html>"
            }
        ]
    },    {
        name: "Module 2: CSS Fundamentals",
        questions: [
            {
                question: "What does CSS stand for?",
                options: [
                    "Colorful Style Sheets",
                    "Computer Style Sheets",
                    "Cascading Style Sheets",
                    "Creative Style Sheets"
                ],
                correctAnswer: "Cascading Style Sheets"
            },
            {
                question: "Which CSS property controls the text size?",
                options: [
                    "text-size",
                    "font-style",
                    "font-size",
                    "text-style"
                ],
                correctAnswer: "font-size"
            },
            {
                question: "How do you select an element with id 'demo'?",
                options: [
                    "#demo",
                    ".demo",
                    "*demo",
                    "demo"
                ],
                correctAnswer: "#demo"
            },
            {
                question: "How do you select elements with class name 'test'?",
                options: [
                    "*test",
                    "#test",
                    "test",
                    ".test"
                ],
                correctAnswer: ".test"
            },
            {
                question: "Which CSS property is used to change the background color?",
                options: [
                    "color",
                    "bgcolor",
                    "background-color",
                    "background"
                ],
                correctAnswer: "background-color"
            },
            {
                question: "How do you make each word in a text start with a capital letter?",
                options: [
                    "text-transform: capitalize",
                    "text-style: capital",
                    "transform: capitalize",
                    "font-transform: capitalize"
                ],
                correctAnswer: "text-transform: capitalize"
            },
            {
                question: "Which property is used to change the font of an element?",
                options: [
                    "font-style",
                    "font-family",
                    "font-weight",
                    "font-change"
                ],
                correctAnswer: "font-family"
            },
            {
                question: "How do you display a border like this: 'Solid red border'?",
                options: [
                    "border: solid red;",
                    "border-color: red; border-style: solid;",
                    "border-color: red;",
                    "border-style: solid-red;"
                ],
                correctAnswer: "border: solid red;"
            },
            {
                question: "How do you select all p elements inside a div element?",
                options: [
                    "div p",
                    "div.p",
                    "div + p",
                    "div > p"
                ],
                correctAnswer: "div p"
            },
            {
                question: "Which CSS property is used to control the spacing between elements?",
                options: [
                    "spacing",
                    "margin",
                    "padding",
                    "border"
                ],
                correctAnswer: "margin"
            }
        ]
    },    {
        name: "Module 3: JavaScript Basics",
        questions: [
            {
                question: "Inside which HTML element do we put the JavaScript?",
                options: [
                    "<javascript>",
                    "<scripting>",
                    "<js>",
                    "<script>"
                ],
                correctAnswer: "<script>"
            },
            {
                question: "How do you create a function in JavaScript?",
                options: [
                    "function = myFunction()",
                    "function myFunction()",
                    "function:myFunction()",
                    "function => myFunction()"
                ],
                correctAnswer: "function myFunction()"
            },
            {
                question: "How do you call a function named 'myFunction'?",
                options: [
                    "call myFunction()",
                    "myFunction()",
                    "call function myFunction()",
                    "Call.myFunction()"
                ],
                correctAnswer: "myFunction()"
            },
            {
                question: "How to write an IF statement in JavaScript?",
                options: [
                    "if i = 5 then",
                    "if i = 5",
                    "if (i == 5)",
                    "if i == 5 then"
                ],
                correctAnswer: "if (i == 5)"
            },
            {
                question: "How to write an IF statement for executing some code if 'i' is NOT equal to 5?",
                options: [
                    "if (i != 5)",
                    "if i <> 5",
                    "if i =! 5 then",
                    "if (i <> 5)"
                ],
                correctAnswer: "if (i != 5)"
            },
            {
                question: "How does a WHILE loop start?",
                options: [
                    "while (i <= 10)",
                    "while i = 1 to 10",
                    "while (i <= 10; i++)",
                    "while i <= 10"
                ],
                correctAnswer: "while (i <= 10)"
            },
            {
                question: "How does a FOR loop start?",
                options: [
                    "for (i = 0; i <= 5; i++)",
                    "for (i <= 5; i++)",
                    "for i = 1 to 5",
                    "for (i = 0; i <= 5)"
                ],
                correctAnswer: "for (i = 0; i <= 5; i++)"
            },
            {
                question: "How can you add a comment in JavaScript?",
                options: [
                    "<!-- This is a comment -->",
                    "// This is a comment",
                    "/* This is a comment */",
                    "'This is a comment"
                ],
                correctAnswer: "// This is a comment"
            },
            {
                question: "What is the correct way to write a JavaScript array?",
                options: [
                    "var colors = 'red', 'green', 'blue'",
                    "var colors = ['red', 'green', 'blue']",
                    "var colors = (1:'red', 2:'green', 3:'blue')",
                    "var colors = 1 = ('red'), 2 = ('green'), 3 = ('blue')"
                ],
                correctAnswer: "var colors = ['red', 'green', 'blue']"
            },
            {
                question: "How do you round the number 7.25, to the nearest integer?",
                options: [
                    "Math.round(7.25)",
                    "round(7.25)",
                    "Math.rnd(7.25)",
                    "rnd(7.25)"
                ],
                correctAnswer: "Math.round(7.25)"
            }
        ]
    },    {
        name: "Module 4: Web Accessibility",
        questions: [
            {
                question: "What does WCAG stand for?",
                options: [
                    "Web Content Accessibility Guidelines",
                    "Web Content Application Guidelines",
                    "Web Compliance Accessibility Guide",
                    "Web Content Accessibility Guide"
                ],
                correctAnswer: "Web Content Accessibility Guidelines"
            },
            {
                question: "Which attribute should be used to provide alternative text for images?",
                options: [
                    "title",
                    "alt",
                    "description",
                    "caption"
                ],
                correctAnswer: "alt"
            },
            {
                question: "Which of the following is an appropriate use of the <label> element?",
                options: [
                    "<label><input type='checkbox'> Accept terms</label>",
                    "<label>Accept terms <checkbox></label>",
                    "<label for='terms'>Accept terms</label>",
                    "<label>Terms: <input></label>"
                ],
                correctAnswer: "<label><input type='checkbox'> Accept terms</label>"
            },
            {
                question: "What is the purpose of ARIA landmarks?",
                options: [
                    "To add visual styling to regions of a page",
                    "To identify regions of a page for screen readers",
                    "To create navigation links within a page",
                    "To validate HTML structure"
                ],
                correctAnswer: "To identify regions of a page for screen readers"
            },
            {
                question: "Which element should be used for the main content area of a web page?",
                options: [
                    "<content>",
                    "<section>",
                    "<main>",
                    "<body>"
                ],
                correctAnswer: "<main>"
            },
            {
                question: "What is the minimum contrast ratio recommended by WCAG AA standards?",
                options: [
                    "2:1",
                    "3:1",
                    "4.5:1",
                    "7:1"
                ],
                correctAnswer: "4.5:1"
            },
            {
                question: "Which of these is NOT a principle of the WCAG guidelines?",
                options: [
                    "Perceivable",
                    "Operable",
                    "Responsive",
                    "Robust"
                ],
                correctAnswer: "Responsive"
            },
            {
                question: "Which HTML element is best suited for indicating the current page in a navigation menu?",
                options: [
                    "<strong>",
                    "<em>",
                    "<mark>",
                    "aria-current='page'"
                ],
                correctAnswer: "aria-current='page'"
            },
            {
                question: "Which is the correct markup for a button that opens a dialog?",
                options: [
                    "<button onclick='openDialog()'>Open</button>",
                    "<button aria-haspopup='dialog'>Open</button>",
                    "<a href='#dialog'>Open</a>",
                    "<div role='button'>Open</div>"
                ],
                correctAnswer: "<button aria-haspopup='dialog'>Open</button>"
            },
            {
                question: "Which of these is NOT a valid ARIA role?",
                options: [
                    "navigation",
                    "banner",
                    "container",
                    "main"
                ],
                correctAnswer: "container"
            }
        ]
    }
];
