/*** Hangman Game

Notes:

* `undefined` represents a letter not yet found by the user.
* `null` represents an empty space in the game board (no letter).

***/

// import { getRandomNumber } from "jdcUtil.js";
// import * as jdcUtil FROM "jdcUtil.js"

// "clean" board (no letters)
const BOARD_INIT = [
    null , null , null , null , null , null , null , null , null , null , null , null ,
    null , null , null , null , null , null , null , null , null , null , null , null
];

// inital amount of tries
const TRIES_LEFT_INIT = 10;

// game status
const GAME_STATUS_INIT = 0;
const GAME_STATUS_RUNNING = 1;
const GAME_STATUS_WIN = 2;
const GAME_STATUS_LOSE = 3;

// last key action
const LAST_KEY_ACTION_INIT = 0;
const LAST_KEY_ACTION_START = 1;
const LAST_KEY_ACTION_NO_LETTER = 2;
const LAST_KEY_ACTION_USED_LETTER = 3;
const LAST_KEY_ACTION_MISSED_LETTER = 4;
const LAST_KEY_ACTION_FOUND_LETTER = 5;

// message object templates
const MESSAGE_INIT = {
    header: "Welcome to the World of Formula 1" ,
    body1: "Formula 1 has the fastest drivers on earth!" ,
    body2: "Press any key to start!" };

const MESSAGE_NEW_GAME = {
    header: "Ready, Set, Go!" ,
    body1: "Can you guess the Formula 1 driver's name?" ,
    body2: "Choose a letter!"
}
const MESSAGE_NO_LETTER = {
    header: "'$LETTER' Is Not A Letter" ,
    body1: "Choose a letter!" ,
    body2: ""
}
const MESSAGE_USED_LETTER = {
    header: "Already Tried '$LETTER'" ,
    body1: "Choose a different letter!" ,
    body2: ""
}
const MESSAGE_FOUND_LETTER = {
    header: "You Found '$LETTER'" ,
    body1: "There are $FOUND_COUNT '$LETTER's in the name! Keep it up!" ,
    body2: "Choose a letter!"
}
const MESSAGE_MISSED_LETTER = {
    header: "There Is No '$LETTER'" ,
    body1: "You have $TRIES_LEFT tries left!" ,
    body2: "Choose a letter!"
}
const MESSAGE_WIN = {
    header: "You Win!" ,
    body1: "It's $NAME, $DESCRIPTION!" ,
    body2: "Press any key to try a new name!"
}
const MESSAGE_LOSE = {
    header: "You Lose" ,
    body1: "Don't give up!" ,
    body2: "Press any key to try a new name!"
}

// hangman word dictionary
var hangmanWords = [
    {
        name: "Sergio 'Checo' Perez" ,
        description: "The Tire Whisperer" ,
        boardSolution: [
            "S" , "E" , "R" , "G" , "I" , "O" , null , null , null , null , null , null ,
            null , null , null , null , null , null , null , "P" , "E" , "R" , "E" , "Z"
        ]
    } ,
    {
        name: "Nigel Mansell" ,
        description: "The British Lion" ,
        boardSolution: [
            "N" , "I" , "G" , "E" , "L" , null , null , null , null , null , null , null ,
            null , null , null , null , null , "M" , "A" , "N" , "S" , "E" , "L" , "L"
        ]
    } ,
    {
        name: "Alain Prost" ,
        description: "The Professor" ,
        boardSolution: [
            "A" , "L" , "A" , "I" , "N" , null , null , null , null , null , null , null ,
            null , null , null , null , null , null , null , "P" , "R" , "O" , "S" , "T"
        ]
    } ,
    {
        name: "Michael Schumacher" ,
        description: "the most dominant driver in history" ,
        boardSolution: [
            "M" , "I" , "C" , "H" , "A" , "E" , "L" , null , null , null , null , null ,
            null , null , "S" , "C" , "H" , "U" , "M" , "A" , "C" , "H" , "E" , "R"
        ]
    } ,
    {
        name: "Kimi Raikkonen" ,
        description: "The Iceman" ,
        boardSolution: [
            "K" , "I" , "M" , "I" , null , null , null , null , null , null , null , null ,
            null , null , null , "R" , "A" , "I" , "K" , "K" , "O" , "N" , "E" , "N"
        ]
    }
]

// initial game state
var hangmanGame = {
    gameStatus: GAME_STATUS_INIT ,
    lastKeyAction: LAST_KEY_ACTION_INIT ,
    hangmanWord: undefined ,
    board: BOARD_INIT ,
    foundLetters: [] ,
    missedLetters: [] ,
    triesLeft: TRIES_LEFT_INIT ,
    wins: 0 ,
    message: Object.assign( {} , MESSAGE_INIT )
}


/*** FUNCTION getNewBoard()

Returns a new board based on the source board, with all letters hidden.

* If the source board has `null`, the new board will have `null`.
* If the source board has a letter (not `null`), the new board will have `undefined` (letter to find).

***/
var getNewBoard = function( sourceBoard ) {
    console.group( "getNewBoard()" );
    // console.logObject( "sourceBoard" , sourceBoard );

    var result = [];
    sourceBoard.forEach(
        letter => {
            if ( letter === null ) {
                result.push( letter );
            }
            else {
                result.push( undefined );
            }
        }
    );

    // console.logObject( "result" , result );
    console.groupEnd();
    return result;
}


/*** FUNCTION newGame()

Resets game state to start a new game.

***/

var newGame = function() {
    console.group( "newGame()" );

    // reset game status
    hangmanGame.gameStatus = GAME_STATUS_RUNNING;
    // reset last key action
    hangmanGame.lastKeyAction = LAST_KEY_ACTION_START;
    // randomly select a new word
    hangmanGame.hangmanWord = hangmanWords[ getRandomNumber( hangmanWords.length ) ];
    // console.logObject( "hangmanGame.hangmanWord" , hangmanGame.hangmanWord );
    // resed the board based on the new word
    hangmanGame.board = getNewBoard( hangmanGame.hangmanWord.boardSolution );
    // reset list of found letters;
    hangmanGame.foundLetters = [];
    // reset list of used letters
    hangmanGame.missedLetters = [];
    // reset amount of tries
    hangmanGame.triesLeft = TRIES_LEFT_INIT;
    // reset message
    hangmanGame.message = Object.assign( {} , MESSAGE_NEW_GAME );

    // console.logObject( "hangmanGame" , hangmanGame );
    console.groupEnd();
}


/*** FUNCTION findLetter()

Updates board with all instances of the letter. Returns how many times the letter is found.

***/

var findLetter = function( letter ) {
    console.group( "findLetter()" );
    // console.logObject( "letter" , letter );

    var foundCount = 0;
    // console.logObject( "foundCount" , foundCount );

    for (
        var boardSolutionIndex = 0 ;
        boardSolutionIndex < hangmanGame.hangmanWord.boardSolution.length ;
        boardSolutionIndex++ ) {
        // console.logObject( "boardSolutionIndex" , boardSolutionIndex );
        // console.logObject( "hangmanGame.hangmanWord.boardSolution[ boardSolutionIndex ]" , hangmanGame.hangmanWord.boardSolution[ boardSolutionIndex ] );
        if ( hangmanGame.hangmanWord.boardSolution[ boardSolutionIndex ] === letter ) {
            foundCount++;
            hangmanGame.board[ boardSolutionIndex ] = letter;
        }
    }

    // console.logObject( "hangmanGame.board" , hangmanGame.board );
    // console.logObject( "foundCount" , foundCount );
    console.groupEnd();
    return foundCount;
}


/*** FUNCTION playLetter()

Updates game state by playing with the given letter.

***/

var playLetter = function( letter ) {
    console.group( "playLetter()" );
    // console.logObject( "letter" , letter );

    // check action
    if ( letter.match( /^[A-Z]$/ ) === null ) {
        // letter is not valid; do not play
        // update last key action
        hangmanGame.lastKeyAction = LAST_KEY_ACTION_NO_LETTER;
        // update message
        hangmanGame.message = Object.assign( {} , MESSAGE_NO_LETTER );
        hangmanGame.message.header = hangmanGame.message.header.replace( "$LETTER" , letter );
    }
    else if (
        ( hangmanGame.missedLetters.indexOf( letter ) > -1 ) ||
        ( hangmanGame.foundLetters.indexOf( letter ) > -1 ) ) {
        // letter has been used; do not play
        // update last key action
        hangmanGame.lastKeyAction = LAST_KEY_ACTION_USED_LETTER;
        // update message
        hangmanGame.message = Object.assign( {} , MESSAGE_USED_LETTER );
        hangmanGame.message.header = hangmanGame.message.header.replace( "$LETTER" , letter );
    }
    else {
        // letter has not been used; play
        // check if the letter exists
        if ( hangmanGame.hangmanWord.boardSolution.indexOf( letter ) === -1 ) {
            // missed letter
            // update last key action
            hangmanGame.lastKeyAction = LAST_KEY_ACTION_MISSED_LETTER;
            // add letter to missed letters
            hangmanGame.missedLetters.push( letter );
            // reduce tries left
            hangmanGame.triesLeft--;
            // update message
            hangmanGame.message = Object.assign( {} , MESSAGE_MISSED_LETTER );
            hangmanGame.message.header = hangmanGame.message.header.replace( "$LETTER" , letter );
            hangmanGame.message.body1 = hangmanGame.message.body1.replace( "$TRIES_LEFT" , hangmanGame.triesLeft.toString() );

            // check for lose condition
            if ( hangmanGame.triesLeft === 0 ) {
                // update game status
                hangmanGame.gameStatus = GAME_STATUS_LOSE;
                // updagte message
                hangmanGame.message = Object.assign( {} , MESSAGE_LOSE );
                hangmanGame.message.header = hangmanGame.message.header.replace( "$LETTER" , letter );
                hangmanGame.message.body1 = hangmanGame.message.body1.replace( "$TRIES_LEFT" , hangmanGame.triesLeft.toString() );
            }
        }
        else {
            // found letter
            // update last key action
            hangmanGame.lastKeyAction = LAST_KEY_ACTION_FOUND_LETTER;
            // add letter to used letters
            hangmanGame.foundLetters.push( letter );
            // show all instances of letter
            var foundCount = findLetter( letter );
            // update message
            hangmanGame.message = Object.assign( {} , MESSAGE_FOUND_LETTER );
            hangmanGame.message.header = hangmanGame.message.header.replace( "$LETTER" , letter );
            hangmanGame.message.body1 =
                hangmanGame.message.body1
                    .replace( "$FOUND_COUNT" , foundCount.toString() )
                    .replace( "$LETTER" , letter );

            // check for win condition
            if ( hangmanGame.board.equals( hangmanGame.hangmanWord.boardSolution ) ) {
                // update game status
                hangmanGame.gameStatus = GAME_STATUS_WIN;
                // increment wins
                hangmanGame.wins++;
                // update message
                hangmanGame.message = Object.assign( {} , MESSAGE_WIN );
                hangmanGame.message.body1 =
                    hangmanGame.message.body1
                        .replace( "$NAME" , hangmanGame.hangmanWord.name )
                        .replace( "$DESCRIPTION" , hangmanGame.hangmanWord.description );
            }
        }
    }

    // console.logObject( "hangmanGame" , hangmanGame );
    console.groupEnd();
}


/*** FUNCTION updateDomMessage
***/

var updateMessageDom = function() {
    console.group( "updateMessageDom()" );

    // get elements
    var alertElement = document.getElementById( "hangmanGame-message-alert" );
    var headerElement = document.getElementById( "hangmanGame-message-header" );
    var body1Element = document.getElementById( "hangmanGame-message-body1" );
    var body2Element = document.getElementById( "hangmanGame-message-body2" );

    // set CSS classes
    alertElement.classList.remove( "alert-primary" );
    alertElement.classList.remove( "alert-secondary" );
    alertElement.classList.remove( "alert-success" );
    alertElement.classList.remove( "alert-danger" );
    alertElement.classList.remove( "alert-warning" );
    alertElement.classList.remove( "alert-info" );
    alertElement.classList.remove( "alert-light" );
    alertElement.classList.remove( "alert-dark" );
    if ( hangmanGame.lastKeyAction === LAST_KEY_ACTION_INIT ) {
        alertElement.classList.add( "alert-info" );
    }
    else if ( hangmanGame.lastKeyAction === LAST_KEY_ACTION_START ) {
        alertElement.classList.add( "alert-info" );
    }
    else if ( hangmanGame.lastKeyAction === LAST_KEY_ACTION_NO_LETTER ) {
        alertElement.classList.add( "alert-warning" );
    }
    else if ( hangmanGame.lastKeyAction === LAST_KEY_ACTION_USED_LETTER ) {
        alertElement.classList.add( "alert-warning" );
    }
    else if ( hangmanGame.lastKeyAction === LAST_KEY_ACTION_MISSED_LETTER ) {
        alertElement.classList.add( "alert-danger" );
    }
    else if ( hangmanGame.lastKeyAction === LAST_KEY_ACTION_FOUND_LETTER ) {
        alertElement.classList.add( "alert-success" );
    }
    else {
        alertElement.classList.add( "alert-info" );
    }

    // set content
    headerElement.textContent = hangmanGame.message.header;
    body1Element.textContent = hangmanGame.message.body1;
    if ( hangmanGame.message.body2 == "" ) {
        body2Element.innerHTML = '&nbsp';
    }
    else {
        body2Element.textContent = hangmanGame.message.body2;
    }

    console.groupEnd();
}


/*** FUNCTION updateBoardDom
***/

var updateBoardDom = function() {
    console.group( "updateBoardDom()" );

    for ( var index = 0 ; index < hangmanGame.board.length ; index++ ) {
        // get element ID
        var letterElementId = "hangmanGame-board-" + index.toString();
        var cardElementId = letterElementId + "-card";
        // console.logObject( "letterElementId" , letterElementId );
        // console.logObject( "cardElementId" , cardElementId );

        // get elements
        var letterElement = document.getElementById( letterElementId );
        var cardElement = document.getElementById( cardElementId );

        // set CSS classes
        cardElement.classList.remove( "bg-primary" );
        cardElement.classList.remove( "bg-secondary" );
        cardElement.classList.remove( "bg-success" );
        cardElement.classList.remove( "bg-danger" );
        cardElement.classList.remove( "bg-warning" );
        cardElement.classList.remove( "bg-info" );
        cardElement.classList.remove( "bg-light" );
        cardElement.classList.remove( "bg-dark" );
        if ( hangmanGame.board[ index ] === null ) {
            cardElement.classList.add( "bg-secondary" );
        }
        else if ( hangmanGame.board[ index ] === undefined ) {
            cardElement.classList.add( "bg-light" );
        }
        else {
            cardElement.classList.add( "bg-success" );
        }

        // hide/show cards when starting game
        if ( hangmanGame.lastKeyAction === LAST_KEY_ACTION_START ) {
            if ( hangmanGame.board[ index ] === null ) {
                cardElement.style.display = "none";
            }
            else {

                cardElement.style.display = "flex";
            }
        }

        // set content
        if ( hangmanGame.board[ index ] === null ) {
            letterElement.innerHTML = "&nbsp;";
        }
        else if ( hangmanGame.board[ index ] === undefined ) {
            letterElement.innerHTML = "&nbsp;";
        }
        else {
            letterElement.textContent = hangmanGame.board[ index ];
        }
    }

    console.groupEnd();
}


/*** FUNCTION updateMissedLettersDom
***/

var updateMissedLettersDom = function() {
    console.group( "updateMissedLettersDom()" );

    if ( hangmanGame.lastKeyAction === LAST_KEY_ACTION_START ) {
        // reset for new game
        for ( var index = 0 ; index < 10 ; index++ ) {
            var missedLetterElementId = "hangmanGame-missedLetters-" + index.toString();
            // console.logObject( "missedLetterElementId" , missedLetterElementId );
            var cardElementId = ( "hangmanGame-missedLetters-" + index.toString() + "-card" );
            // console.logObject( "cardElementId" , cardElementId );

            // get element
            var missedLetterElement = document.getElementById( missedLetterElementId );
            var cardElement = document.getElementById( cardElementId );

            // set CSS classes
            cardElement.classList.remove( "bg-primary" );
            cardElement.classList.remove( "bg-secondary" );
            cardElement.classList.remove( "bg-success" );
            cardElement.classList.remove( "bg-danger" );
            cardElement.classList.remove( "bg-warning" );
            cardElement.classList.remove( "bg-info" );
            cardElement.classList.remove( "bg-light" );
            cardElement.classList.remove( "bg-dark" );
            cardElement.classList.add( "bg-clear" );

            // set content
            missedLetterElement.innerHTML = "&nbsp;";
        }
    }
    else if ( hangmanGame.lastKeyAction == LAST_KEY_ACTION_MISSED_LETTER ) {
        // add last missed letter
        var index = ( hangmanGame.missedLetters.length - 1 );

        // get element ID
        var missedLetterElementId = "hangmanGame-missedLetters-" + index.toString();
        // console.logObject( "missedLetterElementId" , missedLetterElementId );
        var cardElementId = ( "hangmanGame-missedLetters-" + index.toString() + "-card" );
        // console.logObject( "cardElementId" , cardElementId );

        // get element
        var missedLetterElement = document.getElementById( missedLetterElementId );
        var cardElement = document.getElementById( cardElementId );

        // set CSS classes
        cardElement.classList.remove( "bg-primary" );
        cardElement.classList.remove( "bg-secondary" );
        cardElement.classList.remove( "bg-success" );
        cardElement.classList.remove( "bg-danger" );
        cardElement.classList.remove( "bg-warning" );
        cardElement.classList.remove( "bg-info" );
        cardElement.classList.remove( "bg-light" );
        cardElement.classList.remove( "bg-dark" );
        cardElement.classList.add( "bg-danger" );

        // set content
        missedLetterElement.textContent = hangmanGame.missedLetters[ index ];
    }

    console.groupEnd();
}


/*** FUNCTION playSound()
***/

var playSound = function() {
    console.group( "playSound()" );

    if ( hangmanGame.gameStatus === GAME_STATUS_WIN ) {
        var audio = new Audio( "assets/audio/47_-_Secret_of_Mana_-_SNES_-_Victory_Theme.ogg" );
        audio.play();
    }
    else if ( hangmanGame.lastKeyAction === LAST_KEY_ACTION_FOUND_LETTER ) {
        var audio = new Audio( "assets/audio/48_-_Secret_of_Mana_-_SNES_-_Orb_Chime.ogg" );
        audio.play();
    }

    console.groupEnd();
}

/*** FUNCTION updateDom

Updates the HTML DOM with the current state of the hangman game.

***/

var updateDom = function() {
    console.group( "updateDom()" );

    // update message
    updateMessageDom();
    // update triesLeft
    document.getElementById( "hangmanGame-triesLeft" ).textContent = hangmanGame.triesLeft.toString();
    // update wins
    document.getElementById( "hangmanGame-wins" ).textContent = hangmanGame.wins.toString();
    // update board
    updateBoardDom();
    // update used letters
    updateMissedLettersDom();
    // play sound
    playSound();

    console.groupEnd();
}


/*** FUNCTION main()

Main procedure. Handles event `keypress`.

***/

var main = function( event ) {
    console.group( "main()" );
    // console.logObject( "event" , event );

    var letter = event.key.toUpperCase();
    // console.logObject( "letter" , letter );

    // check action
    if (
        ( hangmanGame.gameStatus === GAME_STATUS_INIT ) ||
        ( hangmanGame.gameStatus === GAME_STATUS_WIN ) ||
        ( hangmanGame.gameStatus === GAME_STATUS_LOSE ) ) {
        // start a new game
        newGame();
    }
    else {
        // play in the current game
        playLetter( letter );
    }
    
    // update display
    updateDom();

    console.groupEnd();
}

document.addEventListener( "keypress" , main );
updateDom();
