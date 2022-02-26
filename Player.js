speed = 8
K1_LENGTH = 70;
K2_LENGTH = 5*8;

SWING_TIME = 8
SWING_ACC = 0.522
SWING_ACC_TIME = 4
SWING_FRICTION = 1

const HAND_POSITION = [[6, 12], [6, 12], [4, 12], [2, 12], [2, 12]]

class Player {
  constructor() {
    this.x = 0
    this.y = 50
  
    this.k1x = 20;
    this.k1y = 100;
  
    this.k2x = 40;
    this.k2y = 100;
  
    this.swingTime = 0;
    this.kalleTime = 0;
  
    this.sprite = new newSprite('Player', 0.15);
    this.wheelSprite = new newSprite('Wheels', 1);
    this.wagonSprite = new newSprite('Killingen', 1)
    this.playerRotation = 0;
    this.rotation1 = 0;
    this.rotation2 = 0;
    
    this.w1 = 0;
    this.w2 = 0;
    
    this.k2vx = 0;
    this.k2vy = 0;
    
    this.bagage = 0;
  }
  
  tick()  {
    
    let dx = 0;
    let dy = 0;
    
    if (keyIsDown(LEFT_ARROW)){
      dx = -speed;
    } else if (keyIsDown(RIGHT_ARROW)) {
      dx = speed;
    }
    
    if (keyIsDown(UP_ARROW)) {
      dy = -speed;
    } else if (keyIsDown(DOWN_ARROW)) {
      dy = speed;
    }
    
    let speedFactor = 5/(5+this.bagage)
    
    this.x += dx*speedFactor;
    this.y += dy*speedFactor;
    
    this.x = constrain(this.x, -1000, 1000)
    this.y = constrain(this.y, -1000, 1000)
    
    TRASHROOM.collideObject(this)
    
    if (abs(dx) > 0 || abs(dy) > 0) {
      this.sprite.play()
      this.playerRotation = atan2(dy, dx)
      let temp = dirToIndex(this.playerRotation)
      this.sprite.setAnimation(temp[0])
      this.sprite.flip = temp[1]
    } else {
      this.sprite.stop()
    }
    
    if (keyIsDown(32) && this.swingTime <= 0) {
      this.swingTime = SWING_TIME;
      playSound('SWING')
    }
    
    if (this.swingTime <= 0) {
      //MOVEMENT
      dx = this.x-this.k1x;
      dy = this.y-this.k1y;
      this.k1x = this.x-K1_LENGTH*dx/sqrt(dx*dx+dy*dy)
      this.k1y = this.y-K1_LENGTH*dy/sqrt(dx*dx+dy*dy)
      
      this.rotation1 = atan2(dy, dx)
      
      dx = this.k1x-this.k2x;
      dy = this.k1y-this.k2y;
      this.rotation2 = atan2(-dy, -dx)
      if (abs(this.w2) > 0) {
        //print(this.w2)
        this.rotation2 += this.w2
        //this.w2 -= Math.sign(this.w2)*min(abs(this.w2), 0.5*SWING_FRICTION);
        this.w2 = this.w2/1.5
      }
      
      this.k2x = this.k1x+K2_LENGTH*cos(this.rotation2)
      this.k2y = this.k1y+K2_LENGTH*sin(this.rotation2)
      //this.k2x = this.k1x-K2_LENGTH*dx/sqrt(dx*dx+dy*dy)
      //this.k2y = this.k1y-K2_LENGTH*dy/sqrt(dx*dx+dy*dy)
      
      //this.rotation2 = atan2(-dy, -dx)
    } else {
      let oldRot = this.rotation2+this.rotation1;
      
      //SWING
      dx = this.k1x-this.x;
      dy = this.k1y-this.y;
      
      if (this.swingTime > SWING_TIME-SWING_ACC_TIME) {
         //print('Acc')
        this.w1 += SWING_ACC;
        this.w2 += SWING_ACC;
      } else {
        //print('Dec')
        this.w1 -= Math.sign(this.w1)*min(abs(this.w1), SWING_FRICTION)
        this.w2 -= Math.sign(this.w2)*min(abs(this.w2), SWING_FRICTION)
      }
      //print(this.w1)
      this.rotation1 = atan2(dy, dx)-this.w1;
      this.k1x = this.x+K1_LENGTH*cos(this.rotation1)
      this.k1y = this.y+K1_LENGTH*sin(this.rotation1)
      
      
      
      
      dx = this.k2x-this.k1x;
      dy = this.k2y-this.k1y;
      this.rotation2 = atan2(dy, dx)-this.w2;
    
      let dr = ((this.rotation1-this.rotation2+PI) % (2*PI)) - PI
      
      this.w2 -= dr/2;
      //this.rotation2 += this.w2
      this.k2x = this.k1x+K2_LENGTH*cos(this.rotation2)
      this.k2y = this.k1y+K2_LENGTH*sin(this.rotation2)
      
      this.swingTime -= 1;
      
      
      //Hit check
      for (let i = 0; i < kidObjects.length; i++) {
        let o = kidObjects[i]
        
        if (o==this) {
          continue;
        }
        let dx = o.x-this.x;
        let dy = o.y-this.y;
        let dist = sqrt(dx*dx+dy*dy)
        
        o.addPanic(1000/(dist*SWING_TIME))
        
        if (dist > K1_LENGTH+K2_LENGTH) {
          continue;
        }
        
        let r = atan2(dy, dx)
        if (((r-oldRot+PI) % (2*PI)) - PI < 0 && ((r-this.rotation2-this.rotation1+PI) % (2*PI)) - PI > 0 ){
          gameObjects.splice(gameObjects.indexOf(o), 1)
          kidObjects.splice(kidObjects.indexOf(o), 1)
          playSound('Scream')
          
          this.bagage += 1
        }
        
      }
    }
    
    let temp = dirToIndex(this.rotation1)
    this.wheelSprite.setAnimation(temp[0])
    this.wheelSprite.flip = temp[1]
    
    temp = dirToIndex(PI+this.rotation2)
    this.wagonSprite.setAnimation(temp[0])
    this.wagonSprite.flip = temp[1]
    
    PAN_X = this.x-SCR_WIDTH/2;
    PAN_Y = this.y-SCR_HEIGHT/2;
    
    if (keyIsDown(66) && this.kalleTime <= 0) {
      gameObjects.push(new Kalle(this.x, this.y, this.playerRotation))
      this.kalleTime = 30;
      playSound('CAN-THROW')
    }
    
    this.kalleTime--;
  }
  
  show() {
    
    let c = color(255, 0, 0)
    
    //fill(c)
    //circle(this.x, this.y, 20)
    
    stroke(color(0,0,0))
    
    strokeWeight(3)
    let handPos = [...HAND_POSITION[this.sprite.animation_index]];
    
    if (this.sprite.flip) {
      handPos[0] = 8-handPos[0]
    }
    
    line(this.x+handPos[0]*5-4*5-PAN_X, this.y+handPos[1]*5-16*5-PAN_Y, this.k1x-PAN_X, this.k1y-PAN_Y)
    
    //line(this.k2x, this.k2y, this.k1x, this.k1y)
    
    this.wheelSprite.show(this.k1x-PAN_X, this.k1y-PAN_Y)
    this.wagonSprite.show(this.k2x-PAN_X, this.k2y-PAN_Y)
    this.sprite.show(this.x-PAN_X, this.y-PAN_Y);
    
    /*
    fill(c)
    circle(this.x-PAN_X, this.y-PAN_Y, 20)
    circle(this.k1x-PAN_X, this.k1y-PAN_Y, 20)
    circle(this.k2x-PAN_X, this.k2y-PAN_Y, 20)
    */
  }
  
  getDepth() {
    return -this.y
  }
  
}

class Kalle {
  constructor(x, y, direction) {
    this.x = x;
    this.y = y;
    this.vely = 12*sin(direction)
    this.velx = 12*cos(direction)
    
    this.height = 20
    this.velh = 3
    
    this.sprite = new newSprite('Kalle', 0.15);
    
    this.sprite.play()
    
    this.ground = false
    this.removeTime = 0;
  }
  
  tick() {
    
    if (this.ground) {
      if (millis() >= this.removeTime) {
        gameObjects.splice(gameObjects.indexOf(this), 1)
      }
      
      if (this.sprite.frame_index == 2) {
        this.sprite.stop()
        this.sprite.setFrame(2)
      }

    } else {
      this.velh -= 1/10
      this.height += this.velh;
    
      this.x += this.velx
      this.y += this.vely
    
      for (let i = 0; i < kidObjects.length; i++) {
        let o = kidObjects[i]
        
        if (o.unconscious) {
          continue;
        }
        
        let dx = this.x-o.x;
        let dy = this.y-this.height-o.y;
        
        if (abs(dx) > 5*3 || dy < -13*5 || dy > 0)
          continue
      
        o.knockout()
        gameObjects.splice(gameObjects.indexOf(this), 1)
        playSound('CAN-HIT')
        
        for (let j = 0; j < kidObjects.length; j++) {
          let o = kidObjects[j]
        
          let dx = o.x-this.x;
          let dy = o.y-this.y;
          let dist = sqrt(dx*dx+dy*dy)
        
          o.addPanic(1000/(dist))
        }
      }
    
      if (this.height <= 0) {
        this.ground = true
        this.removeTime = millis()+10*1000
        this.sprite = new newSprite('Kalle-Spill', 3)
        this.sprite.play()
        let dx = this.x-player.x
        let dy = this.y-player.y
        //playSound('Long Scream', min(50000/(dx*dx+dy*dy), 1), 1)
        playSound('CAN-HIT', min(50000/(dx*dx+dy*dy), 1), 1)
      }
    }
    
    
  }
  
  show() {
    this.sprite.show(this.x-PAN_X, this.y-PAN_Y-this.height)
  }
  
  getDepth() {
    return -this.y;
  }
}