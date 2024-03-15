var dict = [];
var sixLetterDict = [];

var usedLetters = [];
var unusedLetters = [];

var usedWords = [];
var validWords = [];

var correct = false;
var bg = "normal";
var bgColorTimer = 0;

var points = 0;
var targetPoints = 0;

var scene = "title";

function setup() {
  createCanvas(600,300);

  for(let i = 0; i < dict.length; i++) {
    sixLetterDict.push(dict[i]);
  }
}

function keyPressed() {
  if(key == "\t") {
    scene = "game";
    setGame();
  }

  if(scene == "game") {
    if(key == "`") {
      scene = "summary";
      validWords = getValidWords();
    } else if(key == "\n" && usedLetters.length >= 3) {
      correct = isInDict(tilesToString(usedLetters)) && !usedWords.contains(tilesToString(usedLetters));
      backgroundColorTimer = 10;

      if(isInDict(tilestoString(usedLetters)) {
        background = "right";  
      } else {
        background = "wrong";
      }

      if(usedWords.contains(tilesToString(usedLetters)) {
        background = "used";
      }

      if(correct) {
        switch(usedLetters.length()) {
          case 3:
            targetPoints += 100;
            break;
          case 4:
            targetPoints += 400;
            break;
          case 5:
            targetPoints += 1200;
            break;
          case 6:
              targetPoints += 2000;
            break;
        }

        usedWords.add(tilesToString(usedLetters));

        for(let i = usedLetters.length - 1; i >= 0; i--) {
          usedLetters[i].targetY = 180;
          unusedLetters.add(usedLetters.remove(i));
        }

        for(let i = 0; i < 
      }

      
    }
  }
}

function Tile(x, y) {
  this.x = x;
  this.y = y;

  this.targetX = x;
  this.targetY = y;

  this.letter = letter;

  this.show = function() {
    strokeWeight(3);
    stroke(0);
    fill(255,0,255,100);
    rect(x, y, 60, 60);

    textSize(40);
    fill(0);
    textAlign(CENTER, CENTER);
    text(this.letter.toUpperCase(), x + 30, y + 30);

    if( (this.x-targetX)*(this.x-targetX) + (this.y-targetY)*(this.y-targetY) > 4) {
      this.x += 0.6*(targetX - x);
      this.y += 0.6*(targetY - y);
    } else {
      this.x = this.targetX;
      this.y = this.targetY;
    }
  }
}

