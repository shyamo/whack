/* Wack-a-mole */
/* Copyright 2016 Shyam B */
var game = {
  
    variables:  {
         //randomGremlin: new array()
        myInterval: undefined,
        hit: 0,
        hitMade: true,
        miss: 0,
        intervalCount: 0,
        level: 1,
        speed: 1600,
        speedSubtract : 200,
        newLevelVar : 10,
        countPopup: 0,
        diff: 0
    },
    
    init: function() {
        console.log("//game initialized//");
        game.setup();
        game.events();
    },
    
    events: function() {
        $(document).on('click', function() {
            if ( !$(event.target).hasClass("play") ) {
                game.hitMiss(event.target);
            }
            
        });
        $('.play').on('click', function() {
            game.play(game.variables.speed);
        });
        $('.reset').on('click', function() {
            location.reload();
        })
    },
    
    setup: function() {
        //setup scaffolding
        var innerTemplate = "<div class='col-xs-3'>"+
                   "<div class='hole-con'>"+
                        "<div class='hole'>"+
                            "<div class='gremlin'></div>"+
                        "</div>"+
                   "</div>"+
                "</div>";
        
        for (i=1;i<6;i++) {
            for (j=1; j<5; j++) {
                $('.container').append(innerTemplate);
            }
        }
        
        
        
        
        game.setHexColors();
        
        var gremlinId =1;
        $('.gremlin').each(function() {
            var className = "g" + gremlinId;
            $(this).addClass(className);
            gremlinId++;
        });
        
    },
    
    //sets color into cardArray for each icon
    setHexColors: function() {
        var randomColor; 
        $('.gremlin').each(function() {
            for (i=1; i< 5; i++) {
                randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
                $(this).css({"background-image":"url(images/gremlin.svg) , linear-gradient("+ randomColor +", #000)"});
            }
        });
    },
    
    hitMiss: function(elem) {
        if ($(elem).hasClass("gremlin-show")) {
            game.variables.hit++;
            $(elem).removeClass("gremlin-show").addClass("gremlin-hit");
            game.variables.hitMade == true;
        } 
    },
    
    gameOver: function() {
        game.stopInterval();
        $('.game-over').show();
        
    },
    
    updateScore: function() {
        $('.hits').text(game.variables.hit);
        $('.misses').text(game.variables.diff - 1);
    },
    
    play: function(timeout) {
        game.variables.myInterval = setInterval(function() {
            game.showMoles(timeout);
        }, timeout)
    },
    
    stopInterval: function() {
        clearTimeout(game.variables.myInterval);
    },
    
    showMoles: function(timeout) {
        //console.log(game.variables.hit);
        game.checkLevel();
        var countHoles = $('.gremlin').length;
        var ranGremlin = game.randomGremlin(countHoles);
        var gremlinElem = ".g" + ranGremlin;
        
        $('.gremlin').removeClass("gremlin-hit");
        $(gremlinElem).addClass("gremlin-show").delay(timeout).queue(function() {
                           $(this).removeClass("gremlin-show");
                           $(this).dequeue();
                       });
        game.variables.intervalCount++;
        game.variables.countPopup++;
        
        game.variables.diff = game.variables.countPopup - game.variables.hit;
        
        setTimeout(game.waitForChange, timeout);
   
    },
    
    waitForChange: function() {
        
        if (game.variables.diff > 1) {
            console.log(game.variables.countPopup, game.variables.hit)
            game.variables.miss++;
            $('.life' + game.variables.diff).hide();    
        }
        if (game.variables.diff > 3) {
            game.gameOver();
            $('.lives').hide();
        } else {
            game.updateScore();
        }
        
    },
    
    randomGremlin: function(maxGremlin) {
        return Math.floor(Math.random() * (maxGremlin) + 1)    ;
    },
    
    checkLevel: function() {
        
        if (game.variables.intervalCount == game.variables.newLevelVar) {
            game.stopInterval();//stop current interval
            game.variables.intervalCount = 0;//reset intervalCount
            
            if (game.variables.speed <= game.variables.speedSubtract) {
                clearTimeout(game.variables.myInterval);
            }
            game.variables.speed -= game.variables.speedSubtract; //increase game speed
            game.variables.level++;
            $('.level').text(game.variables.level);
            game.play(game.variables.speed);
            //console.log(game.variables.speed)
        }
    }
    
    
};

$(document).ready(function() {
    game.init();
});