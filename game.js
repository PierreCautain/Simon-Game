var buttonColors = ["red", "blue", "green", "yellow"];

var userClickedPattern = [];
var gamePattern = [];

var started = false;
var level = 0;

$(document).keypress(function() { // when a key is pressed
    if (!started) {
        $("#level-title").text("Level " + level);
        nextSequence();
        started = true;
    }
});

$(".btn").click(function() {  // when a button is clicked

    var userChosenColor = $(this).attr("id");
    userClickedPattern.push(userChosenColor);
   
    playSound(userChosenColor);
    animatePress(userChosenColor);

    //2. Call checkAnswer() after a user has clicked and chosen their answer, passing in the index of the last answer in the user's sequence.
    checkAnswer(userClickedPattern.length-1);
});

function checkAnswer(currentLevel) {
    console.log("Checking level " + currentLevel);
    console.log("User pattern: " + userClickedPattern);
    console.log("Game pattern: " + gamePattern);
    
    // Only check if the current input matches the game pattern
    if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
        // If we've completed the sequence, wait and go to next level
        if (userClickedPattern.length === gamePattern.length) {
            setTimeout(function() {
                nextSequence();
            }, 1000);
        } 
    } else {
            // Wrong click
            playSound("wrong");
            $("#level-title").text("Game Over, Press Any Key to Restart");
            $("body").addClass("game-over");
            setTimeout(function() {
                $("body").removeClass("game-over");
            }, 2000);
            $(document).keypress(function() {
                started = false;
                startOver()
    
            });
        }
}

function nextSequence() { // function to start the next sequence
    userClickedPattern = [];

    level++;
    $("#level-title").text("Level " + level);

    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColor = buttonColors[randomNumber]; 
    gamePattern.push(randomChosenColor);
    
    console.log("New Game Pattern: " + gamePattern);  // Log the new game pattern
    
    $("#" + randomChosenColor).fadeOut(100).fadeIn(100); // animate the button
    playSound(randomChosenColor); // play the sound
   
}

function playSound(name) {
    var audio = new Audio("sounds/" + name + ".mp3");
    audio.play();
}

function animatePress(currentColor) {
    $("#" + currentColor).addClass("pressed");
    setTimeout(function() {
        $("#" + currentColor).removeClass("pressed");
    }, 100);
}

function startOver() {
    gamePattern = [];
    started = true;
    userClickedPattern = [];
    $("#level-title").text("Level " + level);
    $(".btn").removeClass("pressed");
    level = 0;
    nextSequence();
}
