# JavaScript Trivia CLI Game

## Task 1: Define the Problem
This project creates a command-line trivia game that allows a user to select answers, receive feedback after each response, and see a final game summary with a score and total elapsed time. The game also keeps the experience engaging by presenting questions one at a time and adding a short countdown before the quiz begins.

## Task 2: Determine the Design
The application uses a simple menu-driven design built in JavaScript. A question bank is stored in an array of objects, and the script loops through each question in order. The user enters an answer using the keyboard, the answer is checked against the correct option, and the script prints a helpful explanation for both correct and incorrect responses. Each question includes a countdown timer, and the overall session also tracks elapsed time using JavaScript time values from `Date.now()`. Asynchronous pauses are handled with `setTimeout`.

## Task 3: Develop the Code
The project is implemented in `trivia.js` and includes:
- A main menu with Start Quiz and Exit options
- A question array and object-based data structure
- A loop that processes questions sequentially
- Functions to display questions, check answers, and print final results
- A `map()` array iteration method to build the quiz overview
- `setTimeout`-based delays for a more interactive experience
- A terminal-based interface using `readline` for reading user input

## Task 4: Test and Refine
The game was tested by running the script in Node.js and validating the input flow for correct and incorrect answers. The script confirms that the menu works, choices are validated, score calculation is accurate, and the game displays final feedback when complete.

## Task 5: Document and Maintain
This README documents the purpose, structure, and flow of the application. The code is organized into clear functions so it is easy to update or extend with more questions, different difficulty levels, or a larger score system.

## Run the Project
1. Open a terminal in this folder.
2. Run one of the following commands:
   - `npm start`
   - `node trivia.js`

## Project Highlights
- Uses JavaScript functions and loops
- Uses arrays and array iteration (`map`)
- Implements asynchronous timing with `setTimeout`
- Provides interactive command-line gameplay
- Tracks score and elapsed time
