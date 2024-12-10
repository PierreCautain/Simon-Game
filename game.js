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

$(".btn").on("mouseenter touchstart", function(e) {
    e.preventDefault();  // Prevent any default behavior
    
    var userChosenColor = $(this).attr("id");
    var button = $(this);
    
    // Only add the pressed class if it's not already pressed
    if (!button.hasClass("pressed")) {
        // Store the original background color
        var originalColor = button.css('background-color');
        
        button.addClass("pressed");
        // Only play sound if game has started
        if (started) {
            playSound(userChosenColor);
        }
        
        // Always remove the pressed class and restore original color after 200ms
        setTimeout(function() {
            button.removeClass("pressed");
            button.css('background-color', originalColor);
            button.css('opacity', '1');  // Force opacity back to 1
        }, 200);
    }
}).on("mouseleave", function() {
    // Optional: handle mouse leave if needed
    $(this).removeClass("pressed");
});

// Keep the touch handler separate
$(document).on("touchend touchcancel", function(e) {
    e.preventDefault();
    $(".btn").removeClass("pressed");
});

$(".btn").on("click touchend", function() {
    // If game hasn't started, ignore the button press
    if (!started) {
        return;  // Don't process the click until game has started
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
