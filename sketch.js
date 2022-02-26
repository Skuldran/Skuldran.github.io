gameObjects = [];
kidObjects = [];

CODE = [];

PAN_X = 0;
PAN_Y = 0;
SCR_WIDTH = 800;
SCR_HEIGHT = 800;
PAPER_SHOW = false;
PAPER_STARTTIME = 0; 
PAPER_SPRITE = [];
PAPER_FONT = [];
TRASHROOM = [];
KID_RIP_SPRITE = [];

score = 0;
SHOW_SCORE = 0;
TIME_END = 0;

TIME_SCORE_FACTOR = 5;
TIME_COUNTDOWN = 0;
LEVEL = 0

SONG = null;

function preload() {
  //Objects
  loadSprite('assets/sprites/Player.png', 'Player', 8, 16, 4, 16, 5)
  loadSprite('assets/sprites/Wheels.png', 'Wheels', 8, 8, 4, 4, 5)
  loadSprite('assets/sprites/Killingen.png', 'Killingen', 24, 24, 12, 12, 5)
  loadSprite('assets/sprites/Kid.png', 'Kid', 8, 16, 4, 16, 5)
  loadSprite('assets/sprites/Kid-Panic.png', 'Kid-Panic', 8, 16, 4, 16, 5)
  loadSprite('assets/sprites/Kid2.png', 'Kid2', 8, 16, 4, 16, 5)
  loadSprite('assets/sprites/Kid2-Panic.png', 'Kid2-Panic', 8, 16, 4, 16, 5)
  loadSprite('assets/sprites/Kid-Lying.png', 'Kid-Lying', 16, 24, 3, 14, 5)
  loadSprite('assets/sprites/Kid2-Lying.png', 'Kid2-Lying', 16, 24, 3, 14, 5)
  loadSprite('assets/sprites/Trashroom.png', 'Trashroom', 60, 36, 30, 36, 5)
  loadSprite('assets/sprites/KalleSpratt.png', 'Kalle', 5, 5, 3, 3, 5)
  loadSprite('assets/sprites/SodaSpill.png', 'Kalle-Spill', 9, 9, 5, 5, 5)
  
  //UI
  loadSprite('assets/sprites/Paper.png', 'Paper', 54, 40, 27, 20, 10)
  loadSprite('assets/sprites/Kid-Rip.png',  'Kid-Rip', 8, 16, 0, 0, 5)
  
  soundList = ['assets/sfx/Scream1.mp3', 
               'assets/sfx/Scream2.mp3', 
               'assets/sfx/Scream3.mp3', 
               'assets/sfx/Scream4.mp3', 
               'assets/sfx/Scream5.mp3', 
               'assets/sfx/Scream6.mp3', 
               'assets/sfx/Scream7.mp3']
  loadSoundFiles(soundList, 'Scream')
  
  soundList = ['assets/sfx/LONG-SCREAM-1.mp3', 
               'assets/sfx/LONG-SCREAM-2.mp3', 
               'assets/sfx/LONG-SCREAM-3.mp3', 
               'assets/sfx/LONG-SCREAM-4.mp3', 
               'assets/sfx/LONG-SCREAM-5.mp3']
  loadSoundFiles(soundList, 'Long Scream')
  
  loadSoundFiles(['assets/sfx/BEEP.mp3'], 'BEEP')
  loadSoundFiles(['assets/sfx/BEEP-NO.mp3'], 'BEEP-NO')
  loadSoundFiles(['assets/sfx/BEEP-YES.wav'], 'BEEP-YES')
  loadSoundFiles(['assets/sfx/1337.mp3'], '1337')
  
  loadSoundFiles(['assets/sfx/SWING-1.wav',
                  'assets/sfx/SWING-2.wav'], 'SWING')
  loadSoundFiles(['assets/sfx/Can-Hit.wav',
                  'assets/sfx/Can-Hit2.wav',
                  'assets/sfx/Can-Hit3.wav'], 'CAN-HIT')
  loadSoundFiles(['assets/sfx/Throw.wav'], 'CAN-THROW')
  
  loadSoundFiles(['assets/sfx/FestsångUTN2.mp3'], 'Festsång')
  
  PAPER_FONT = loadFont('assets/fonts/Blokletters-Potlood.ttf')
  print('Finished loading!')
}

function setup() {
  createCanvas(SCR_WIDTH, SCR_HEIGHT);
  
  frameRate(30);
  angleMode(RADIANS)

  PAPER_SPRITE = new newSprite('Paper', 1)
  KID_RIP_SPRITE = new newSprite('Kid-Rip', 1)
  
  startLevel(0);
}

function draw() {
  gameObjects.forEach((o) => o.tick())
  
  //background(color(100, 100, 100));
  background(color(100,100,100))
  fill(color(230, 230, 230))
  rect(-1050-PAN_X, -1050-PAN_Y, 2100, 2100)
  
  gameObjects.sort((a, b) => b.getDepth()-a.getDepth())
  gameObjects.forEach((o) => o.show())
  
  if (PAPER_SHOW) {
    let dt = (millis()-PAPER_STARTTIME-2000)/150;
    let paper_y = SCR_HEIGHT/2+dt*dt*dt
    
    PAPER_SPRITE.show(SCR_WIDTH/2, paper_y)
    
    let code_str = ''
    for (let i = 0; i < code.length; i++) {
      code_str = code_str + code[i]
    }

    fill(color(0,0,0))
    textAlign(CENTER, CENTER)
    textFont(PAPER_FONT)
    textSize(48)
    text('Koden är:', SCR_WIDTH/2, paper_y-50)
    text(code_str, SCR_WIDTH/2, paper_y+50)
    
    
    if (dt > 2000) {
      PAPER_SHOW = false
    }
  }
  
  textFont('Georgia')
  textSize(36)
  textAlign(LEFT, TOP)
  text('Poäng: ' + SHOW_SCORE, 20, 20)
  
  let s = round((TIME_END-millis())/1000)
  let m = floor(s/60)
  
  let ss = (s%60).toLocaleString('en-US', { minimumIntegerDigits: 2})
  
  text('Tid: ' + m + ':' + ss, 20, 60)
  
  for (let i=0; i<player.bagage; i++) {
    KID_RIP_SPRITE.show(20+i*50, 120)
  }
  
  showMinimap()
  
  if (kidObjects.length == 0) {
    TIME_COUNTDOWN = s;
  }
  
  if (TIME_COUNTDOWN > 0 && player.bagage == 0) {
    TIME_END -= 1000;
    score += TIME_SCORE_FACTOR;
  }
  
  SHOW_SCORE = min(SHOW_SCORE+TIME_SCORE_FACTOR, score)
  
  if (s <= 0 && TIME_COUNTDOWN <= 0) {
    LEVEL += 1
    startLevel(LEVEL)
  }
}

function startLevel(difficulty) {
  gameObjects = []
  kidObjects = []
  
  TIME_END = millis()+1000*2*60;
  
  player = new Player()
  gameObjects.push(player)
  
  for (var i = 0; i < 5+difficulty; i++) {
    kid = new Kid(-500+1000*random(), -500+1000*random())
    gameObjects.push(kid)
    kidObjects.push(kid)
  }
  
  if (difficulty==0) {
    generateCode([1,3,7,5])
  } else {
    generateCode(4+floor(difficulty/3))
  }
  
  TRASHROOM = new Trashroom(0, 0)
  gameObjects.push(TRASHROOM)
  
  //playSound('Lille-Olle', 0.4)
  
  if (SONG != null) {
    SONG.stop()
  } 
  SONG = playSound('Festsång', 0.5);
}

function generateCode(forceCode) {
  if (typeof forceCode == 'number') {
    code = [];
    for (let i=0; i<forceCode; i++) {
      code[i] = floor(random(10))
    }
  } else {
    code = forceCode;
  }
  print('Code: ' + code)
  
  PAPER_SHOW = true
  PAPER_STARTTIME = millis()
}

function showMinimap() {
  fill(color(255, 255, 255))
  rect(SCR_WIDTH-175, 25, 150, 150)
  
  fill(color(255, 0, 0))
  for (let i = 0; i < kidObjects.length; i++) {
      let o = kidObjects[i]
      
      circle(SCR_WIDTH-100+3*o.x/(40), 100+3*o.y/(40), 10)
  }
  
  fill(color(0, 255, 0))
  circle(SCR_WIDTH-100+3*player.x/(40), 100+3*player.y/(40), 10)
}

function keyTyped() {
  TRASHROOM.keyTyped(key)
}

/*
function keyPressed() {
  print(keyCode)
}
*/