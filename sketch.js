var fullDict;
var dict = [];
var sixDict = [];

var rack = [];
/*

there are two racks: the top rack, and the bottom rack. letters begin on the bottom rack.
this represents letters which the player can use. when a player chooses a letter,
it moves to the top rack, where it becomes part of the word the player submits.
rack represents all the letters at the player's disposal, on the top and bottom rack.
rackUsed carries information about what letters are on the top rack.
if rackUsed[i] = -1, that means that letter i of the top rack is empty.
if rackUsed[i] >= 0, that means that letter i of the top rack is rack[rackUsed[i]]. 

*/
var rackUsed = [-1, -1, -1, -1, -1, -1];

//position of rack letters on screen
var rackPos = [[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]];

var usedWords = [];
var validWords = [];

var points = 0;
var targetPoints = 0;

//to transition backgrounds
var bg = "right";
var bgTimer = 0;

//calculate deltaT
var prevT = 0;

var gameTimer = 0;

var scene = "title";

function preload() {
  fullDict = loadTable("dictionary.csv", "csv");
}

function setup() {
  createCanvas(windowWidth,windowHeight);

  for(let i = 0; i < fullDict.getRowCount(); i++) {
    let word = fullDict.getString(i, 0).toUpperCase();

    if(word.length == 6) sixDict.push(word);
    if(3 <= word.length && word.length <= 6) dict.push(word);
  }

  //set initial rackposition; before createCanvas, width and height are null, so set here
  rackPos = [[width/2 - 180 + 0,height/2 + 120],[width/2 - 180 + 60,height/2 + 120],[width/2 - 180 + 120,height/2 + 120],[width/2 - 180 + 180,height/2 + 120],[width/2 - 180 + 240,height/2 + 120],[width/2 - 180 + 300,height/2 + 120]];

}

//generate prompt
function setRack() {
  let word = sixDict[(int)(Math.random()*sixDict.length)];
  let temp = word.split("");

  rack = [];
  for(let i = 0; i < 6; i++) {
    let r = (int)(Math.random() * temp.length);
    rack.push(temp[r]);
    temp.splice(r,1);
  }

}

//handle keys in game scene
function gameKeyPressed() {

  if(keyCode == 192) {
    scene = "review";
    validWords = [];
    getValidWords(0, dict.length);
  }

  //first, check if the key is available in the rack; if it is, use it.
  //flag is to break the loop checking available keys if a key is found
  let flag = false;
  for(let i = 0; i < rack.length && !flag; i++) {
    if(key.toUpperCase() == rack[i] && rackUsed.indexOf(i) < 0) {

      //finds the first available position in the top rack
      for(let j = 0; j < rackUsed.length; j++) {
        if(rackUsed[j] < 0) {
          flag = true;
          rackUsed[j] = i;
          break;
        }
      }
    }
  }

  if(keyCode == BACKSPACE) {
    for(let i = rackUsed.length - 1; i >= 0; i--) {
      if(rackUsed[i] >= 0) {
        rackUsed[i] = -1;
        break;
      }
    }
  }


  let str = "";
  for(let i = 0; i < rackUsed.length && rackUsed[i] >= 0; i++) str += rack[rackUsed[i]];
  if(keyCode == ENTER && str.length >= 3) {
    
    if(usedWords.indexOf(str) == -1 && dict.indexOf(str) >= 0) {
      usedWords.push(str);

      switch(str.length) {
        case 3: targetPoints += 100; break;
        case 4: targetPoints += 400; break;
        case 5: targetPoints += 1200; break;
        case 6: targetPoints += 2000; break;
      }

      bg = "right";

    } else if(usedWords.indexOf(str) >= 0) bg = "repeat";
    
    else bg = "wrong";
    

    bgTimer = millis();
    rackUsed = [-1,-1,-1,-1,-1,-1];
  }
}

function game() {

  background(255);

  let deltaT = millis() - prevT;

  //all bg changes have timer 500 ms
  if(millis() - bgTimer >= 500) {
    background(0, 255, 255,100);
  } else if(bg == "right") {
    background(0, 255, 0, 100);
  } else if(bg == "wrong") {
    background(255, 0, 0, 100);
  } else if (bg == "repeat") {
    background(255, 255, 0, 100);
  }

  textSize(60);
  textAlign(CENTER, BOTTOM);
  text(points, width/2, height/2 - 30);
  //point gain animation - all animations - based on deltaT for consistency
  if(points < targetPoints) {
    if(Math.abs(targetPoints - points) > 5) points = (int) (points + 5/deltaT*(targetPoints - points));
    else points = targetPoints;
  } else if(points >= targetPoints) points = targetPoints;

  textSize(40);
  textAlign(RIGHT, TOP);
  text(60 - Math.floor((millis() - gameTimer)/1000), width/2 + 180, height/2 - 120);
  if(millis() - gameTimer >= 60000) {
    scene = "review";
    validWords = [];
    getValidWords(0, dict.length);
  }

  //empty, top rack
  fill(128);
  strokeWeight(3);
  rect(width/2 - 180, height/2, 360, 60);
  for(let i = 0; i < 6; i++) {
    line(width/2 - 180 + 60 * i, height/2, width/2 - 180 + 60 * i, height/2 + 60);
  }

  textSize(40);
  textAlign(CENTER, CENTER);
  for(let i = 0; i < 6; i++) {
    fill(240);
    rect(rackPos[i][0], rackPos[i][1], 60, 60);

    fill(0);
    text(rack[i], rackPos[i][0] + 30, rackPos[i][1] + 35);

    //move tile to correct position
    if(rackUsed.indexOf(i) >= 0) {
      rackPos[i][0] += 7.5/deltaT*(rackUsed.indexOf(i)*60 + (width/2 - 180) - rackPos[i][0]);
      rackPos[i][1] += 7.5/deltaT*((height/2) - rackPos[i][1]);
    } else {
      rackPos[i][0] += 7.5/deltaT*(i*60 + (width/2 - 180) - rackPos[i][0]);
      rackPos[i][1] += 7.5/deltaT*((height/2 + 120) - rackPos[i][1]);
    }
  }

  prevT = millis();
}

function getValidWords(start, end) {

  let temp;
  let word;
  let pass;

  for(let i = start; i < end; i++) {
    //copy the rack
    temp = [rack[0],rack[1],rack[2],rack[3],rack[4],rack[5]];
    word = dict[i];
    pass = true;

    //for every letter of the chosen word
    for(let j = 0; j < word.length; j++) {

      let k = temp.indexOf(word.substring(j, j + 1));

      if(k >= 0) {
        temp[k] = "-";
      } else {
        pass = false;
        break;
      }
    }

    if(pass) validWords.push(word);
  }

}

function keyPressed() {
  switch(scene) {
    case "title":
    if(keyCode == 32) scene = "transition2game";
    break;

    case "game":
    gameKeyPressed();
    break;

    case "review":
    if(keyCode == 32) scene = "transition2game";
    break;
  }
}

function keyReleased() {
  if(scene == "transition2game") {
    if(keyCode == 32) {
      scene = "game";
      rackUsed = [-1,-1,-1,-1,-1,-1];
      rackPos = [[width/2 - 180 + 0,height/2 + 120],[width/2 - 180 + 60,height/2 + 120],[width/2 - 180 + 120,height/2 + 120],[width/2 - 180 + 180,height/2 + 120],[width/2 - 180 + 240,height/2 + 120],[width/2 - 180 + 300,height/2 + 120]];
      points = 0;
      targetPoints = 0;
      
      usedWords = [];
      setRack();
      gameTimer = millis();
    }
  }
}

function draw() {

  switch(scene) {
    
    case "title":
    background(255);
    background(0, 255, 255, 100);
    textAlign(CENTER, CENTER);
    textSize(80);
    text("ANAGRAMS", width/2, height/2);
    
    textAlign(CENTER, TOP);
    textSize(25);
    text("HOLD THEN RELEASE 'SPACE'", width/2, height/2 + 40);
    break;

    case "transition2game":
    background(255);
    background(0,255,0,100);

    textAlign(CENTER, CENTER);
    textSize(80);
    text("ANAGRAMS", width/2, height/2);
    
    textAlign(CENTER, TOP);
    textSize(25);
    text("HOLD THEN RELEASE 'SPACE'", width/2, height/2 + 40);
    break;

    case "game":
    game();
    break;

    case "review":
    background(255);
    background(0, 255, 255, 100);

    textAlign(CENTER, TOP);
    textSize(60);
    textStyle(NORMAL);
    fill(0);
    text(rack.join("") + ", " + points, width/2, 50);
    line(width/4, 120, 3*width/4, 120);

    //15 words per column, stretched out between 140 and height - 100
    textSize(20);
    for(let i = 0; i < validWords.length; i++) {

      if(validWords[i].length == 6) textStyle(BOLD);
      else textStyle(NORMAL);

      if(usedWords.indexOf(validWords[i]) >= 0) fill(230,0,0);
      else fill(0);


      text(validWords[i], width/4 + (int)(i/15) * 100, (height - 100 - 140)/15*(i%15) + 140);
    }

    line(width/4, height - 85, 3*width/4, height - 85);
    textAlign(CENTER, TOP);
    textSize(20);
    textStyle(NORMAL);
    fill(0);
    text("HOLD THEN RELEASE 'SPACE'", width/2, height - 75);

    break;
  }

}
