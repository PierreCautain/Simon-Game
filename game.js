var buttonColors = ["red", "blue", "green", "yellow"];

var userClickedPattern = [];
var gamePattern = [];

var started = false;
var level = 0;

$(document).ready(function() {
    // Add blinking to initial title
    $("#level-title").addClass("blink-text");
});

$(document).on("keypress click touchstart touchend", function(e) {
    // Prevent default behavior for touch events to avoid conflicts
    if (e.type.startsWith('touch')) {
        e.preventDefault();
    }
    
    if (!started) {
        $("#level-title").removeClass("blink-text");
        $("#level-title").text("Level " + level);
        $(".btn").addClass("game-started");
        nextSequence();
        started = true;
    }
});

// Visual feedback on hover/touch without sound
$(".btn").on("mouseenter touchstart", function(e) {
    e.preventDefault();
    
    // Skip everything if game hasn't started
    if (!started) {
        return;  // Exit early if game hasn't started
    }
    
    var button = $(this);
    
    if (!button.hasClass("pressed")) {
        var originalColor = button.css('background-color');
        button.addClass("pressed");
        
        setTimeout(function() {
            button.removeClass("pressed");
            button.css('background-color', originalColor);
            button.css('opacity', '1');
        }, 200);
    }
}).on("mouseleave", function() {
    // Skip everything if game hasn't started
    if (!started) {
        return;  // Exit early if game hasn't started
    }
    $(this).removeClass("pressed");
});

// Sound and game logic only on click/touch
$(".btn").on("click touchend", function() {
    if (!started) {
        return;
    }
    
    var userChosenColor = $(this).attr("id");
    userClickedPattern.push(userChosenColor);
    playSound(userChosenColor);  // Only play sound on actual click/touch
    checkAnswer(userClickedPattern.length-1);
});

// Remove any sound playing from other event handlers
$(document).on("touchend touchcancel", function(e) {
    e.preventDefault();
    // Skip everything if game hasn't started
    if (!started) {
        return;  // Exit early if game hasn't started
    }
    $(".btn").removeClass("pressed");
});

function checkAnswer(currentLevel) {
    if (!started) {
        return;  // Extra safety check
    }
    
    // Only check if the current input matches the game pattern
    if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
        // If we've completed the sequence, wait and go to next level
        if (userClickedPattern.length === gamePattern.length) {
            setTimeout(function() {
                nextSequence();
            }, 1000);
        } 
    } else {
        // Wrong click - Game Over state
        gameOver();
    }
}

// Separate game over function
function gameOver() {
    playSound("wrong");
    started = false;
    $(".btn").removeClass("game-started");
    $("#level-title").text("Game Over ! Click/Touch/Press to Restart");
    $("#level-title").addClass("blink-text");
    $("body").addClass("game-over");
    
    // Remove any existing handlers to prevent duplicates
    $(document).off("keypress click touchstart touchend");
    
    setTimeout(function() {
        $("body").removeClass("game-over");
    }, 1000);

    // Add restart handler after a slight delay
    setTimeout(function() {
        $(document).one("keypress click touchstart touchend", function(e) {
            // Prevent default behavior for touch events
            if (e.type.startsWith('touch')) {
                e.preventDefault();
            }
            if (!started) {
                startOver();
            }
        });
    }, 100);
}

function nextSequence() { // function to start the next sequence
    userClickedPattern = [];

    level++;
    $("#level-title").text("Level " + level);

    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColor = buttonColors[randomNumber]; 
    gamePattern.push(randomChosenColor);
    
    console.log("New Game Pattern: " + gamePattern);  // Log the new game pattern
    
    // Modified animation to ensure button reappears
    $("#" + randomChosenColor)
        .fadeOut(250)
        .fadeIn(250, function() {
            // Ensure button is fully visible after animation
            $(this).css('opacity', '1');
        });
    
    playSound(randomChosenColor);
} 

function playSound(name) {
    var audio = new Audio("sounds/" + name + ".mp3");
    audio.play();
}

function animatePress(currentColor) {
    $("#" + currentColor).addClass("pressed");
    setTimeout(function() {
        $("#" + currentColor).removeClass("pressed");
    }, 200);
}

function startOver() {
    gamePattern = [];
    userClickedPattern = [];
    level = 0;
    started = true; 
    $("#level-title").removeClass("blink-text"); // Stop blinking when game restarts
    $(".btn").removeClass("pressed");
    $(".btn").addClass("game-started");
    nextSequence();
}





