var buttonColors = ["red", "blue", "green", "yellow"];

var userClickedPattern = [];
var gamePattern = [];

var started = false;
var level = 0;

$(document).on("keypress click touchstart touchend", function() { // when a key is pressed or document is clicked
    if (!started) {
        $("#level-title").text("Level " + level);
        nextSequence();
        started = true;
    }
});

// Visual feedback on hover/touch without sound
$(".btn").on("mouseenter touchstart", function(e) {
    e.preventDefault();
    
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
    $(".btn").removeClass("pressed");
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
            $("#level-title").text("Click/Touch/Press to Restart");
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
    
    // Modified animation to ensure button reappears
    $("#" + randomChosenColor)
        .fadeOut(100)
        .fadeIn(100, function() {
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
