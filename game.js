var buttonColors = ["red", "blue", "green", "yellow"];

var userClickedPattern = [];
var gamePattern = [];

var started = false;
var level = 0;

$(document).on("keypress click", function() { // when a key is pressed or document is clicked
    if (!started) {
        $("#level-title").text("Level " + level);
        nextSequence();
        started = true;
    }
});

$(".btn").on("touchstart mousedown", function() {
    if (!started) {
        return;
    }
    
    var userChosenColor = $(this).attr("id");
    playSound(userChosenColor);
});

$(".btn").on("click touchend", function() {
    if (!started) {
        return;
    }
    
    var userChosenColor = $(this).attr("id");
    userClickedPattern.push(userChosenColor);
    checkAnswer(userClickedPattern.length-1);
});

function checkAnswer(currentLevel) {
    if (!started) {
        return;  // Extra safety check
    }
    
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
    
    $("#" + randomChosenColor).fadeIn(100).fadeOut(100).fadeIn(100); // animate the button
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
